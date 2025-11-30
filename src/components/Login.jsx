import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Animated ConnectU refs
  const connectURef = useRef(null);
  const cRef = useRef(null);
  const eRef = useRef(null);
  const uRef = useRef(null);

  useEffect(() => {
    if (connectURef.current) {
      gsap.to(connectURef.current, {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        // Always fetch latest user profile (with _id) after login
        let userProfile = data.user;
        let fetchedProfile = null;
        let userRes;
        try {
          if (userProfile?.role === 'alumni') {
            userRes = await fetch(`${API_BASE_URL}/alumni/me`, {
              headers: { Authorization: `Bearer ${data.token}` },
            });
          } else if (userProfile?.role === 'student') {
            userRes = await fetch(`${API_BASE_URL}/student/me`, {
              headers: { Authorization: `Bearer ${data.token}` },
            });
          } else if (userProfile?.role === 'teacher') {
            userRes = await fetch(`${API_BASE_URL}/teacher/me`, {
              headers: { Authorization: `Bearer ${data.token}` },
            });
          } else if (userProfile?.role === 'tpo') {
            userRes = await fetch(`${API_BASE_URL}/tpo/me`, {
              headers: { Authorization: `Bearer ${data.token}` },
            });
          }
          if (userRes && userRes.ok) {
            fetchedProfile = await userRes.json();
            // Only use fetchedProfile if it has _id and role
            if (fetchedProfile && fetchedProfile._id && fetchedProfile.role) {
              userProfile = fetchedProfile;
            }
          }
        } catch (e) { /* fallback to data.user */ }
        // Defensive: If userProfile is missing _id, try to extract it from fetchedProfile or fallback to token decode
        if (!userProfile._id) {
          if (fetchedProfile && fetchedProfile._id) {
            userProfile._id = fetchedProfile._id;
          } else if (data.user && data.user._id) {
            userProfile._id = data.user._id;
          }
        }
        // Final fallback: If userProfile still has no _id, try to fetch all students and match by email
        if (!userProfile._id && userProfile.email && userProfile.role === 'student') {
          try {
            const allStudentsRes = await fetch(`${API_BASE_URL}/student/all`, {
              headers: { Authorization: `Bearer ${data.token}` },
            });
            if (allStudentsRes.ok) {
              const allStudents = await allStudentsRes.json();
              const found = allStudents.find(s => s.email === userProfile.email);
              if (found && found._id) {
                userProfile._id = found._id;
              }
            }
          } catch (e) { /* ignore */ }
        }
        localStorage.setItem('user', JSON.stringify(userProfile));
        // Show toast before redirect
        toast.success('Login successful!');
        // Redirect to dashboard based on user role (defensive) after a short delay
        const role = userProfile?.role;
        setTimeout(() => {
          if (role === 'student') {
            window.location.href = '/dashboard/student';
          } else if (role === 'alumni') {
            window.location.href = '/dashboard/alumni';
          } else if (role === 'teacher') {
            window.location.href = '/dashboard/teacher';
          } else if (role === 'tpo') {
            window.location.href = '/dashboard/tpo';
          } else {
            toast.success('Login successful!');
          }
        }, 800); // 800ms delay for toast visibility
      } else {
        // Login failed
        setLoginError(data.error || 'Login failed');
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex mt-20 bg-gradient-to-br from-indigo-200 via-white to-cyan-200">
      {/* Left Side: Project Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="/pexels-pixabay-326235.jpg"
          alt="Login Visual"
          className="object-cover w-full h-full rounded-l-3xl shadow-2xl"
        />
      </div>
      {/* Right Side: Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-2 py-4 md:px-4 md:py-8">
        <div className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-lg">Login</h2>
          <p className="text-center text-indigo-800 text-xl mb-8 font-bold drop-shadow-md tracking-wide">
            Welcome back to {" "}
            <span
              ref={connectURef}
              className="inline-block select-none relative align-middle"
              style={{
                background: "none",
                padding: 0,
                margin: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.05em",
                zIndex: 1,
                verticalAlign: "middle"
              }}
            >
              <span
                ref={cRef}
                style={{ display: "inline-block", zIndex: 2, position: "relative" }}
              >C</span>onn
              <span
                ref={eRef}
                style={{ display: "inline-block", zIndex: 2, position: "relative" }}
              >e</span>ct
              <span
                ref={uRef}
                style={{ display: "inline-block", zIndex: 2, position: "relative" }}
              >U</span>
            </span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">Email ID</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 border border-gray-300 rounded-full p-2 shadow-sm hover:bg-indigo-100 transition-colors duration-150 focus:outline-none group"
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10-.825 0-1.63-.1-2.4-.287" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657" /></svg>
                  )}
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-10 opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-10">
                    {showPassword ? "Hide Password" : "Show Password"}
                  </span>
                </button>
              </div>
            </div>
            {loginError && (
              <p className="text-red-600 text-sm font-semibold mt-1 text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg text-lg tracking-wide mt-2"
            >
              Login
            </button>
          </form>
          <p className="mt-8 text-center text-gray-700 text-base">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
