import React from 'react';import {createRoot} from 'react-dom/client';import App from './App.jsx';
import {ready} from './data/memories';
import './styles/global.css';
import './styles/love.css';
// wait (max 4s) until the photo list is verified, then draw the page
Promise.race([ready,new Promise(r=>setTimeout(r,4000))]).then(()=>createRoot(document.getElementById('root')).render(<App/>));
