import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import global_en from './components/Translations/en/global.json';
import global_es from './components/Translations/es/global.json';

i18next.init({
  interpolation: { escapeValue: false },
  lng: "es",
  resources:{
    en:{ global: global_en },
    es:{ global: global_es }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>
);