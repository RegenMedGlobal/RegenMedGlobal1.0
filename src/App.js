import React, { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Main from './pages/Main'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Results from './pages/Results'
import Profile from './pages/Profile'
import DoctorLogin from './pages/DoctorLogin'
import Register from './pages/Register'
import Logout from './pages/Logout'
import Claim from './pages/Claim'
import { Route, Routes, useLocation } from 'react-router-dom'
import AuthProvider from './AuthContext'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Footer from './components/Footer'
import "@fontsource/poppins";
import CodeValidator from './pages/CodeValidator'

function App() {

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
          <Route path='/ResetPassword' element={<ResetPassword />} />
          <Route path='/CodeValidator/:id' element={<CodeValidator />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>

  )
}

export default App
