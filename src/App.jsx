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
import StudentConnections from './components/StudentConnections';
import PostPage from './components/PostPage';

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
            <Footer />
          </>
        } />
        <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/dashboard/student" element={<><StudentDashboard /><Footer /></>} />
        <Route path="/dashboard/alumni" element={<><AlumniDashboard /><Footer /></>} />
        <Route path="/dashboard/teacher" element={<><TeacherDashboard /><Footer /></>} />
        <Route path="/dashboard/tpo" element={<><TPODashboard /><Footer /></>} />
        <Route path="/dashboard/student/connections" element={<><StudentConnections /><Footer /></>} />
        <Route path="/dashboard/student/post" element={<><PostPage /><Footer /></>} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
