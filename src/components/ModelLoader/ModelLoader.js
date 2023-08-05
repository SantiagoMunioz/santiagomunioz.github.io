import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import './Style/ModelLoader.css';

import axios from 'axios';

import { useTranslation } from 'react-i18next';

const d = document;

export const ModelLoader = (props) => {

  //#region Variables
  const [model, setModel] = useState(null);

  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);

  const { t } = useTranslation("global");
  const [textTranslate, setTextTranslate] = useState('');
  const [textTrd, setTextTrd] = useState('');
  //#endregion Variables

  //#region Cargar Modelo
  useEffect(() => {
    const loadModel = async () => {
      console.log("Cargando modelo...");
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      console.log("Modelo cargado");
    };

    loadModel();
  }, []);
  //#endregion Cargar Modelo

  //#region Identificar Imagenes
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvas2 = canvasRef2.current;
    var context = canvas.getContext("2d");
    context.canvas.getContext('2d', { willReadFrequently: true });

    const image = new Image();
    image.src = props.image;

    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      translate();
    };

    /**
       * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
       * 
       * @param {HtmlElement} canvas
       * @param {int} width
       * @param {int} height
       * @param {boolean} resize_canvas if true, canvas will be resized. Optional.
       * Cambiado por RT, resize canvas ahora es donde se pone el chiqitillllllo
       */
    function resampleSingle(canvas, width, height, resize_canvas) {
      var width_source = canvas.width;
      var height_source = canvas.height;
      width = Math.round(width);
      height = Math.round(height);

      var ratio_w = width_source / width;
      var ratio_h = height_source / height;
      var ratio_w_half = Math.ceil(ratio_w / 2);
      var ratio_h_half = Math.ceil(ratio_h / 2);

      var ctx = canvas.getContext("2d");
      var ctx2 = resize_canvas.getContext("2d");
      var img = ctx.getImageData(0, 0, width_source, height_source);
      var img2 = ctx2.createImageData(width, height);
      var data = img.data;
      var data2 = img2.data;

      for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
          var x2 = (i + j * width) * 4;
          var weight = 0;
          var weights = 0;
          var weights_alpha = 0;
          var gx_r = 0;
          var gx_g = 0;
          var gx_b = 0;
          var gx_a = 0;
          var center_y = (j + 0.5) * ratio_h;
          var yy_start = Math.floor(j * ratio_h);
          var yy_stop = Math.ceil((j + 1) * ratio_h);
          for (var yy = yy_start; yy < yy_stop; yy++) {
            var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
            var center_x = (i + 0.5) * ratio_w;
            var w0 = dy * dy; //pre-calc part of w
            var xx_start = Math.floor(i * ratio_w);
            var xx_stop = Math.ceil((i + 1) * ratio_w);
            for (var xx = xx_start; xx < xx_stop; xx++) {
              var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
              var w = Math.sqrt(w0 + dx * dx);
              if (w >= 1) {//pixel too far
                  continue;
              }//hermite filter
              weight = 2 * w * w * w - 3 * w * w + 1;
              var pos_x = 4 * (xx + yy * width_source);
              //alpha
              gx_a += weight * data[pos_x + 3];
              weights_alpha += weight;
              //colors
              if (data[pos_x + 3] < 255)
                  weight = weight * data[pos_x + 3] / 250;
              gx_r += weight * data[pos_x];
              gx_g += weight * data[pos_x + 1];
              gx_b += weight * data[pos_x + 2];
              weights += weight;
            }
          }
          data2[x2] = gx_r / weights;
          data2[x2 + 1] = gx_g / weights;
          data2[x2 + 2] = gx_b / weights;
          data2[x2 + 3] = gx_a / weights_alpha;
        }
      }
      ctx2.putImageData(img2, 0, 0);
    }

    function translate() {
      if (model != null) {
        resampleSingle(canvas, 100, 100, canvas2);
        
        var context2 = canvas2.getContext('2d');
        context2.canvas.getContext('2d', { willReadFrequently: true });
        var arr = [];
        var arr100 = [];
        var imgData = context2.getImageData(0, 0, 100, 100);
        

        //#region Tensor
        // El uso del tensor no es obligatorio en este caso, dado que se utiliza la función
        // classify, ya que esta función se encarga de obtener los valores por si misma. En cambio,
        // la función predict si requiere del uso del tensor.

        for (var p = 0; p < imgData.data.length; p += 4) {
          var red = imgData.data[p] / 255;
          var green = imgData.data[p + 1] / 255;
          var blue = imgData.data[p + 2] / 255;
          var gray = (red + green + blue) / 3;

          arr100.push([gray]);
          if (arr100.length === 100) {
            arr.push(arr100);
            arr100 = [];
          }
        }

        arr = [arr];

        var tensor = tf.tensor4d(arr);
        //#endregion Tensor
         
        model.classify(imgData).then(predictions => {
          console.log('prediccion: ', predictions[0].className);
          d.getElementById('result').innerHTML = (predictions[0].className);
          setTextTranslate(predictions[0].className);
        });
      }
    }
  }, [props.image]);
  //#endregion Identificar Imagenes

  //#region Traducir Texto
  useEffect (() => {

    //#region Información LibreTranslate
    /*
    */
    //#endregion

    let trText = t(textTranslate);
    let textEntryKey = "en";
    let textExitKey = "es";

    let data = {
      q : trText,
      source : textEntryKey,
      target : textExitKey,
      apy_key: ""
    }

    const handleTranslate = async () => {
      try{
        const response = await axios.get(`http://libretranslate.com/translate`, {
          q : trText,
          source : textEntryKey,
          target : textExitKey,
          apy_key: ""
        });
        
        setTextTrd(response.data.translatedText);
        
      }catch (error){
        setTextTrd('Error al traducir: ', error);
      }
    }

    handleTranslate();

    d.getElementById('result1').innerHTML = textTrd;
  },[textTranslate]);
  //#endregion Traducir Texto
  
  return (
    <div className='modelCont'>
      <h2 className='titleResult'>Resultado</h2>
      <canvas className='modelCanv' ref={canvasRef}></canvas>
      <canvas className='modelCanvRslt' ref={canvasRef2}></canvas>
      <h2 id='result' className='rslt'>English: </h2>
      <hr/>
      <h2 id='result1' className='rslt'>Español:</h2>
    </div>
  );
}
