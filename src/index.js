import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReactGA from 'react-ga';

// Initialize Google Analytics with your Measurement ID
ReactGA.initialize('G-E1K3NF9839');

import { BrowserRouter } from 'react-router-dom'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <App />
	</BrowserRouter>
   
);

