import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const loginRef = useRef(null);
  const signupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 80) {
        setShowNavbar(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: showNavbar ? 0 : -100,
        opacity: showNavbar ? 1 : 0,
        duration: 0.5,
        ease: 'power3.out',
        pointerEvents: showNavbar ? 'auto' : 'none',
      });
    }
  }, [showNavbar]);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { y: -40, opacity: 0, scale: 0.8, rotate: -8 },
        { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: 'power4.out' }
      );
    }
    if (loginRef.current) {
      gsap.fromTo(
        loginRef.current,
        { x: 40, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 1.1, delay: 0.3, ease: 'power4.out' }
      );
    }
    if (signupRef.current) {
      gsap.fromTo(
        signupRef.current,
        { x: 60, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 1.1, delay: 0.5, ease: 'power4.out' }
      );
    }
  }, []);

  return (
    <nav ref={navRef} className={`w-full flex items-center justify-between px-6 py-4 shadow-lg fixed top-0 left-0 z-50 transition-all duration-300 ${menuOpen ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500' : 'bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-900'}`}>
      {/* Logo */}
      <div className="flex items-center">
        <span
          ref={logoRef}
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-lg select-none flex items-center"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <span className="flex items-center bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-cyan-900 px-3 py-1 rounded-xl mr-2 shadow-md font-black italic transform -skew-x-6 border-2 border-white transition-all duration-200 hover:scale-110">
            <svg className="w-7 h-7 mr-1 text-cyan-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
              <path d="M8 15l4-4 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ml-1 flex items-baseline">
              Connect
              <span className="ml-1 text-3xl text-cyan-900 font-black not-italic tracking-widest drop-shadow-lg">U</span>
            </span>
          </span>
        </span>
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden flex items-center">
        <button className="text-white focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <button ref={loginRef} onClick={() => navigate('/login')} className="px-6 py-2 rounded-full bg-white text-cyan-800 font-bold shadow-lg border-2 border-cyan-800 hover:bg-cyan-800 hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400">Login</button>
        <button ref={signupRef} onClick={() => navigate('/signup')} className="px-6 py-2 rounded-full bg-yellow-400 text-cyan-900 font-bold shadow-lg border-2 border-yellow-500 hover:bg-yellow-500 hover:text-white hover:scale-110 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300">Sign Up</button>
      </div>

      {/* Fullscreen Mobile Menu */}
      <div className={`fixed top-0 right-0 w-2/3 h-screen z-50 flex flex-col items-center md:hidden transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{
        background: 'linear-gradient(180deg, #06b6d4 0%, #3b82f6 70%, #6366f1 100%)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}>
        <button className="self-end mt-6 mr-6 text-white text-4xl font-bold focus:outline-none hover:scale-125 transition-transform duration-200 drop-shadow-lg" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <span style={{ textShadow: '0 2px 12px #0008' }}>×</span>
        </button>
        <div className="flex flex-col items-center justify-center  w-full gap-8 mt-10">
          <button onClick={() => { setMenuOpen(false); navigate('/login'); }} className="w-4/5 py-3 rounded-2xl bg-white bg-opacity-80 text-cyan-900 text-lg font-bold shadow-xl border-none hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300">Login</button>
          <button onClick={() => { setMenuOpen(false); navigate('/signup'); }} className="w-4/5 py-3 rounded-2xl bg-yellow-400 text-cyan-900 text-lg font-bold shadow-xl border-none hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-200">Sign Up</button>
        </div>
      </div>

      {/* Overlay Blur Background */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300" style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} onClick={() => setMenuOpen(false)}></div>
      )}
    </nav>
  );
};

export default Navbar;
