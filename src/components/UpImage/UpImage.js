import React, { useState } from 'react';
import './Style/UpImage.css';
import { ModelLoader } from '../ModelLoader/ModelLoader';

export const UpImage = _ => {
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = handleFileRead;
            reader.readAsDataURL(file);
        };
    };

    const handleFileRead = (event) => {
        const content = event.target.result;

        setImageUrl(content);
    };

    return(
        <div className='upImage'>
            <input id='img' className='imageInput' type='file' accept='image/png, image/jpeg, image/jpg' onChange={handleFileChange} required/>
            <ModelLoader image={imageUrl} />
        </div>
    );
}