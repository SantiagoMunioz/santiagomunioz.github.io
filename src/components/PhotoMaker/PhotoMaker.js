import React, { useState, useRef } from 'react';
import './Style/PhotoMaker.css';
import { ModelLoader } from '../ModelLoader/ModelLoader';

const d = document, n = navigator;

export const PhotoMaker = _ => {
    const [err, setErr] = useState(null);

    var videoRef = useRef(null);
    var camera = false;
    var canvasRef = useRef(null);
    const [photoImg, setPhotoImg] = useState(null);

    const getUserMedia = async () => {
        try {
            const stream = await n.mediaDevices.getUserMedia({video: true});
            videoRef.current.srcObject = stream;
            camera = true;
        } catch (err) {
            camera = false;
            setErr(err.message);
            console.log(`¡Not access to camera! ${err}`);
        }
    };

    getUserMedia(2);
    
    window.onload = function(){
        getUserMedia();
    }

    const Photo = () => {
        if(d.getElementById('video') != null && camera === true){
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const photo = canvas.toDataURL('image/png');

            setPhotoImg(photo);

        } else {
            console.log('¡Not access to camera!');
            setErr(err.message);
        }
    }
    
    return(
        <div className='photoCont'>
            <div className='err'>
                {err ? (
                    <p className='error'> ¡Se ha encontrado un error "Sin acceso a la cámara" (<mark>{err}</mark>)!</p>
                ) : 
                <div className='videoCont'>
                    <video ref={videoRef} id='video' autoPlay={true}></video>
                    <button id='btn-capture' className='tkPhoto' onClick={Photo}>Tomar Foto</button>
                </div>}
            </div>
            <canvas ref={canvasRef} className='photoCanv' id='canvas' width='300' height='300'></canvas>
            < ModelLoader image={photoImg} />
        </div>
    );
}