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
  const cRef = useRef(null);
  const eRef = useRef(null);
  const uRef = useRef(null);
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
      // Animated ConnectU logo (same as Signup)
      gsap.to(logoRef.current, {
        keyframes: [
          { scale: 1.12, rotation: 4, color: "#0ea5e9", textShadow: "none", duration: 0.7 },
          { scale: 1.08, rotation: -4, color: "#0ea5e9", textShadow: "none", duration: 0.7 },
          { scale: 1.15, rotation: 0, color: "#0ea5e9", textShadow: "none", duration: 0.7 },
          { scale: 1, rotation: 0, color: "#0ea5e9", textShadow: "none", duration: 0.7 },
        ],
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
    if (cRef.current) {
      gsap.to(cRef.current, {
        y: -8,
        duration: 0.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0
      });
    }
    if (eRef.current) {
      gsap.to(eRef.current, {
        y: -8,
        duration: 0.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.3
      });
    }
    if (uRef.current) {
      gsap.to(uRef.current, {
        y: -8,
        duration: 0.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.6
      });
    }
  }, []);

  return (
    <nav ref={navRef} className={`w-full flex items-center justify-between px-6 py-4 shadow-lg fixed top-0 left-0 z-50 transition-all duration-300 ${menuOpen ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500' : 'bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-900'}`}>
      {/* Logo */}
      <div className="flex items-center">
        <span
          ref={logoRef}
          className="text-2xl md:text-3xl font-extrabold tracking-tight select-none flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span
            className="inline-block select-none relative align-middle"
            style={{
              background: "linear-gradient(90deg, #fbbf24 10%, #06b6d4 50%, #6366f1 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 900,
              fontSize: "2.3rem",
              letterSpacing: "0.04em",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.05em",
              zIndex: 1,
              verticalAlign: "middle",
              textShadow: "0 2px 12px #fff, 0 1px 0 #fff, 0 0px 2px #fff"
            }}
          >
            <span
              ref={cRef}
              style={{ display: "inline-block", zIndex: 2, position: "relative", textShadow: "0 2px 12px #fff, 0 1px 0 #fff, 0 0px 2px #fff" }}
            >C</span>onn
            <span
              ref={eRef}
              style={{ display: "inline-block", zIndex: 2, position: "relative", textShadow: "0 2px 12px #fff, 0 1px 0 #fff, 0 0px 2px #fff" }}
            >e</span>ct
            <span
              ref={uRef}
              style={{
                display: "inline-block",
                zIndex: 2,
                position: "relative",
                background: "linear-gradient(90deg, #f43f5e 0%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 900,
                fontSize: "2.7rem",
                marginLeft: "0.1em",
                textShadow: "0 2px 12px #fff, 0 1px 0 #fff, 0 0px 2px #fff"
              }}
            >U</span>
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
