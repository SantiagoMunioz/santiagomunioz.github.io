import React from 'react';
import './Styles/Main.css';

export const Main = _ =>{
    return(
        <div className='infoMain'>
            <h1 className='title'>Traductor de imágenes</h1>
            <div className='info1'>
                <h3 className='titleInfo'>¿De qué se trata?</h3>
                <label>
                    Esta App consiste en el uso de Inteligencia Artificial
                    para ayudar en la enseñanza de idiomas en los niveles
                    académicos de primaria, brindando una herramienta de
                    libre acceso capaz de identificar objetos por medio
                    imágenes.
                </label>
            </div>
            <div className='info2'>
                <h3 className='titleInfo'>¿Cómo funciona?</h3>
                <label>
                    Esta App funciona con una Inteligencia Artificial,
                    que se encargar de identificar la imagen cargada y
                    devuelve el significado del nombre de la misma traducido
                    en el idioma inglés.
                </label>
            </div>
        </div>
    );
}