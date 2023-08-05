import React from 'react';
import './Style/TakePhoto.css';
import { PhotoMaker } from '../PhotoMaker/PhotoMaker';

export const TakePhoto = _ => {
    return(
        <div className='takePhotoCont'>
            <h1 className='tkTitle'>Tomar Foto</h1>
            <PhotoMaker/>
        </div>
    );
}