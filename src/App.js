import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import "@fontsource/poppins";

import AuthProvider from './AuthContext'
import Navbar from './components/Navbar'
// import Footer from './components/Footer'

import ReactGA from 'react-ga';

const Article = lazy(() => import('./pages/articles/Article'));
const Articles = lazy(() => import('./pages/articles/Articles'));
const Author = lazy(() => import('./pages/articles/Author'));
const AuthorSignIn = lazy(() => import('./pages/articles/AuthorSignIn'));
const AuthorSignUp = lazy(() => import('./pages/articles/AuthorSignUp'));
const Claim = lazy(() => import('./pages/Claim'));
const CodeValidator = lazy(() => import('./pages/CodeValidator'));
const Contact = lazy(() => import('./pages/Contact'));
const DoctorLogin = lazy(() => import('./pages/DoctorLogin'));
const Logout = lazy(() => import('./pages/Logout'));
const Main = lazy(() => import('./pages/Main'));
const Profile = lazy(() => import('./pages/Profile'));
const Register = lazy(() => import('./pages/Register'));
const ResetAuthorPassword = lazy(() => import('./pages/articles/ResetAuthorPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Results = lazy(() => import('./pages/Results'));
const Services = lazy(() => import('./pages/Services'));
const SubmitArticle = lazy(() => import('./pages/articles/SubmitArticle'));
const Videos = lazy(() => import('./pages/podcasts/Videos'));

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
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/Services' element={<Services />} />
            <Route path='/home' element={<Main />} />
            <Route path='/Contact' element={<Contact />} />
            <Route path='/Results' element={<Results />} />
            <Route path='/DoctorLogin' element={<DoctorLogin />} />
            <Route path='/Logout' element={<Logout />} />
            <Route path='/Register' element={<Register />} />
            <Route path='/profile/:userId' element={<Profile />} />
            <Route path='/claim' element={<Claim />} />
            <Route path='/articles' element={<Articles />} />
            <Route path="/article/:articleId" element={<Article />} />
            <Route path="/author/:authorId" element={<Author />} />
            <Route path='/submitarticle' element={<SubmitArticle />} />
            <Route path='/authorsignup' element={<AuthorSignUp />} />
            <Route path='/authorsignin' element={<AuthorSignIn />} />
            <Route path='/ResetPassword' element={<ResetPassword />} />
            <Route path='/resetauthorpassword' element={<ResetAuthorPassword />} />
            <Route path='/videos' element={<Videos />} />
            <Route path='/CodeValidator/:id' element={<CodeValidator />} />
          </Routes>
        </Suspense>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App
