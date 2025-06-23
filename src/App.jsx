import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar';
import CenteredVideo from './components/CenteredVideo';
import InfoBoxes from './components/InfoBoxes';
import Footer from './components/Footer';
import ITCompaniesMarquee from './components/ITCompaniesMarquee';
import AlumniShowcase from './components/AlumniShowcase';
import Signup from './components/Signup';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <CenteredVideo />
            <InfoBoxes />
            <ITCompaniesMarquee />
            <AlumniShowcase />
          </>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
