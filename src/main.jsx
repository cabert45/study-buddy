import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './skins.css';
import { initGuestFromUrl, isGuest, guestProfile } from './utils/guest';
import { applySkin } from './utils/skin';
import { applySettings, loadSettings } from './utils/settings';

initGuestFromUrl();
if (isGuest()) {
  applySkin('secondaire'); // avant le premier rendu: pas de flash orange
  applySettings(loadSettings(guestProfile()));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
