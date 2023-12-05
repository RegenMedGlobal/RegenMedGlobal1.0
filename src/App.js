import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/poppins";

import { AppRoutes } from './components/AppRoutes';
import AuthProvider from './AuthContext';
import Navbar from './components/Navbar';
// import Footer from './components/Footer';

import ReactGA from 'react-ga';

// Initialize Google Analytics with your Measurement ID
ReactGA.initialize('G-E1K3NF9839');

function App() {

   useEffect(() => {
    // Track a page view when the component mounts
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const routeLocation = useLocation();
  const [className, setClassName] = useState("");

  useEffect(() => {
    const pathname = routeLocation.pathname;

    switch (pathname) {
      case "/":
        setClassName("page-home");
        break;
      case "/home":
        setClassName("page-home");
        break;
      case "/register":
        setClassName("page-home");
        break;
      case "/about":
        setClassName("non-color");
        break;
      case "/contact":
        setClassName("non-color");
        break;
        case "/article":
        setClassName("non-color");
        break;
      case "/results":
      case "/CodeValidator":
        setClassName("non-color");
        break;
      default:
        setClassName("non-color");
    }
  }, [routeLocation]);

  return (
    <AuthProvider>
      <div className={`App ${className}`}>
        <Navbar />
        <div className="in-body">
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App
