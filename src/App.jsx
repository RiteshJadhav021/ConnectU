import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar';
import CenteredVideo from './components/CenteredVideo';
import InfoBoxes from './components/InfoBoxes';
import Footer from './components/Footer';

function App() {
 

  return (
    <>
      <Navbar />
      <CenteredVideo />
      <InfoBoxes />
      <Footer />
      {/* Main content can go here */}
    </>
  )
}

export default App
