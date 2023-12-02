import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReactGA from 'react-ga';
import { BrowserRouter } from 'react-router-dom';

// polyfill all `core-js` features, including early-stage proposals:
import "core-js";
// or:
import "core-js/features";
// polyfill all actual features - stable ES, web standards and stage 3 ES proposals:
import "core-js/actual";
// polyfill only stable features - ES and web standards:
import "core-js/stable";
// polyfill only stable ES features:
import "core-js/es";

// Initialize Google Analytics with your Measurement ID
ReactGA.initialize('G-E1K3NF9839');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
