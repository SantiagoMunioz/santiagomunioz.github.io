import React from 'react';
import './Style/ChargeImage.css';
import { UpImage } from '../UpImage/UpImage';

export const ChargeImage = _ => {
    return(
        <div className='chargeImageCont'>
            <h1 className='loadTitle'>Subir Imagen</h1>
            <UpImage/>
        </div>
    );
}