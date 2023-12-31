import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReactGA from 'react-ga';
import { BrowserRouter } from 'react-router-dom';

// Initialize Google Analytics with your Measurement ID
ReactGA.initialize('G-E1K3NF9839');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
