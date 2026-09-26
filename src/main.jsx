import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './skins.css';
import { initGuestFromUrl, isGuest, guestProfile } from './utils/guest';
import { applySkin } from './utils/skin';
import { applySettings, loadSettings } from './utils/settings';
import { renvoyerSessionsEnAttente } from './utils/storage';

initGuestFromUrl();
if (isGuest()) {
  applySkin('secondaire'); // avant le premier rendu: pas de flash orange
  applySettings(loadSettings(guestProfile()));
}

// Ce qui n'a pas pu partir pendant une panne repart au démarrage.
renvoyerSessionsEnAttente().catch(() => {});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
