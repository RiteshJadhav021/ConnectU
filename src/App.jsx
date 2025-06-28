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
import StudentDashboard from './components/StudentDashboard';
import AlumniDashboard from './components/AlumniDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import TPODashboard from './components/TPODashboard';
import Testimonials from './components/Testimonials';
import UpcomingEvents from './components/UpcomingEvents';
import Counters from './components/Counters';
import FAQSection from './components/FAQSection';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <CenteredVideo />
            <InfoBoxes />
            <Counters />
            <ITCompaniesMarquee />
            <AlumniShowcase />
            <Testimonials />
            <UpcomingEvents />
            <FAQSection />
          </>
        } />
        <Route path="/signup" element={<><Navbar /><Signup /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/alumni" element={<AlumniDashboard />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/dashboard/tpo" element={<TPODashboard />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
