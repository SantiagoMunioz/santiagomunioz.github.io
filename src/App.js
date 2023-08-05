import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { Main } from './components/Main/Main';
import { ChargeImage } from './components/ChargeImage/ChargeImage';
import { TakePhoto } from './components/TakePhoto/TakePhoto';

function App() {
  let menu='';

  menu=<>
    <li><Link className='nav-link' to='/'>Inicio</Link></li>
    <li><Link className='nav-link' to='/charge-image'>Cargar Imagen🖼</Link></li>
    <li><Link className='nav-link' to='/take-photo'>Tomar Foto📷</Link></li>
  </>;

  return (
    <div className='App'>
      <nav>
        <div className='links'>
          {menu}
        </div>
      </nav>
      <Routes>
        <Route exact path='/' element={ <Main/> } />
        <Route exact path='/charge-image' element={ <ChargeImage/> } />
        <Route exact path='/take-photo' element={ <TakePhoto/> } />
      </Routes>
    </div>
  );
}

export default App;
