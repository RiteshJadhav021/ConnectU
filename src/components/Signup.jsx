import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGsapSignupAnimation } from "./useGsapSignupAnimation";
import gsap from "gsap";
import { toast } from "react-toastify";

const roles = [
  { value: "student", label: "Student" },
  { value: "alumni", label: "Alumni" },
  { value: "teacher", label: "Teacher" },
  { value: "tpo", label: "TPO" },
];

const Signup = () => {
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    prn: "",
    passout: "",
    email: "",
    password: "",
  });
  const [nameError, setNameError] = useState("");
  const [prnError, setPrnError] = useState("");
  const [passoutError, setPassoutError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  
  // OTP-related states
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form data state for OTP process
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    prn: "",
    passout: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const { formRef, imageRef, buttonRef, inputRefs, errorRefs, selectRef } = useGsapSignupAnimation();
  const connectURef = React.useRef(null);

  // For animated ConnectU letters
  const cRef = React.useRef(null);
  const eRef = React.useRef(null);
  const uRef = React.useRef(null);

  React.useEffect(() => {
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
    // Animate C, e, U up and down
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
    if (e.target.name === "name") {
      const value = e.target.value;
      // Remove uppercase enforcement, allow any case
      setNameError("");
      setForm({ ...form, [e.target.name]: value });
    } else if (e.target.name === "prn") {
      const value = e.target.value;
      if (value && !/^\d{0,10}$/.test(value)) {
        setPrnError("The number must be 10 digits only");
      } else if (value.length === 10 || value.length === 0) {
        setPrnError("");
      }
      setForm({ ...form, [e.target.name]: value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setForm({ name: "", prn: "", passout: "", email: "", password: "" });
  };

  const validate = () => {
    let valid = true;
    // Name validation
    if (!form.name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else if (!/^[A-Za-z ]{3,}$/.test(form.name.trim())) {
      setNameError(
        "Name must be only letters and spaces, min 3 chars"
      );
      valid = false;
    } else {
      setNameError("");
    }
    // PRN validation (for students)
    if (role === "student") {
      if (!form.prn.trim()) {
        setPrnError("PRN is required");
        valid = false;
      } else if (!/^\d{10}$/.test(form.prn.trim())) {
        setPrnError("PRN must be exactly 10 digits");
        valid = false;
      } else {
        setPrnError("");
      }
    } else {
      setPrnError("");
    }
    // Passout year validation (for alumni)
    if (role === "alumni") {
      const year = parseInt(form.passout, 10);
      const currentYear = new Date().getFullYear();
      if (!form.passout.trim()) {
        setPassoutError("Passout year is required");
        valid = false;
      } else if (
        !/^\d{4}$/.test(form.passout.trim()) ||
        year < 1950 ||
        year > currentYear
      ) {
        setPassoutError(`Enter a valid year between 1950 and ${currentYear}`);
        valid = false;
      } else {
        setPassoutError("");
      }
    } else {
      setPassoutError("");
    }
    // Email validation
    if (!form.email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setEmailError("Enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }
    // Password validation
    if (!form.password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (
      form.password.length < 6 ||
      !/[A-Za-z]/.test(form.password) ||
      !/\d/.test(form.password)
    ) {
      setPasswordError(
        "Password must be at least 6 chars, include a letter and a number"
      );
      valid = false;
    } else {
      setPasswordError("");
    }
    // Role validation
    if (!role) {
      setRoleError("Role is required");
      valid = false;
    } else {
      setRoleError("");
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      setLoading(true);
      
      // Store form data for OTP verification
      const currentFormData = {
        role,
        name: form.name.trim().toUpperCase(),
        email: form.email,
        prn: form.prn,
        passout: form.passout,
        password: form.password
      };
      setFormData(currentFormData);

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFormData)
      });

      const data = await response.json();
      if (response.ok) {
        setShowOtpForm(true);
        setOtpError('');
        toast.success('OTP sent to your email! Please check and verify.');
      } else {
        setOtpError(data.error || 'Failed to send OTP. Please try again.');
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      setOtpError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setOtpError("OTP must be 6 digits");
      return;
    }
    
    setOtpLoading(true);
    setOtpError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: otpCode.trim() 
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Registration completed successfully!');
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
          if (formData.role === "student") {
            window.location.href = "/dashboard/student";
          } else if (formData.role === "alumni") {
            window.location.href = "/dashboard/alumni";
          } else if (formData.role === "teacher") {
            window.location.href = "/dashboard/teacher";
          } else if (formData.role === "tpo") {
            window.location.href = "/dashboard/tpo";
          }
        }, 1000);
      } else {
        setOtpError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex mt-20 bg-gradient-to-br from-indigo-200 via-white to-cyan-200">
      {/* Left Side: Project Image */}
      <div ref={imageRef} className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="/pexels-pixabay-326235.jpg"
          alt="Signup Visual"
          className="object-cover w-full h-full rounded-l-3xl shadow-2xl"
        />
      </div>
      {/* Right Side: Signup Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-2 py-4 md:px-4 md:py-8">
        <div ref={formRef} className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-lg">
            Sign Up
          </h2>
          <p className="text-center text-indigo-800 text-xl mb-8 font-bold drop-shadow-md tracking-wide">
            Create your account on{" "}
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
          {!showOtpForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Role
              </label>
              <select
                ref={selectRef}
                name="role"
                value={role}
                onChange={handleRoleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
              >
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {roleError && (
                <p ref={el => errorRefs.current[0] = el} className="text-red-600 text-sm font-semibold mt-1">
                  {roleError}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Enter Full Name
              </label>
              <input
                ref={el => inputRefs.current[0] = el}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
              />
              {nameError && (
                <p ref={el => errorRefs.current[1] = el} className="text-red-600 text-sm font-semibold mt-1">
                  {nameError}
                </p>
              )}
            </div>
            {role === "student" && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  PRN Number
                </label>
                <input
                  ref={el => inputRefs.current[1] = el}
                  type="text"
                  name="prn"
                  value={form.prn}
                  onChange={(e) => {
                    // Only allow digits and max 10 characters
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setForm({ ...form, prn: value });
                    if (value.length === 10 || value.length === 0) {
                      setPrnError("");
                    } else {
                      setPrnError("PRN must be exactly 10 digits");
                    }
                  }}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
                />
                {prnError && (
                  <p ref={el => errorRefs.current[2] = el} className="text-red-600 text-sm font-semibold mt-1">
                    {prnError}
                  </p>
                )}
              </div>
            )}
            {role === "alumni" && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Passout Year
                </label>
                <input
                  ref={el => inputRefs.current[2] = el}
                  type="text"
                  name="passout"
                  value={form.passout}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
                />
                {passoutError && (
                  <p ref={el => errorRefs.current[3] = el} className="text-red-600 text-sm font-semibold mt-1">
                    {passoutError}
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Email ID
              </label>
              <input
                ref={el => inputRefs.current[3] = el}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
              />
              {emailError && (
                <p ref={el => errorRefs.current[4] = el} className="text-red-600 text-sm font-semibold mt-1">
                  {emailError}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Password
              </label>
              <div className="relative">
                <input
                  ref={el => inputRefs.current[4] = el}
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
              {passwordError && (
                <p ref={el => errorRefs.current[5] = el} className="text-red-600 text-sm font-semibold mt-1">
                  {passwordError}
                </p>
              )}
            </div>
            
            <button
              ref={buttonRef}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg text-lg tracking-wide mt-2 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Enter OTP
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  We've sent a 6-digit OTP to {formData.email}
                </p>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                  required
                />
              </div>
              
              {otpError && (
                <div className="text-red-600 text-sm font-semibold">
                  {otpError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={otpLoading || otpCode.length !== 6}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 hover:from-green-600 hover:to-blue-700 disabled:opacity-50"
              >
                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowOtpForm(false)}
                className="w-full text-gray-600 font-medium py-2 hover:text-gray-800 transition duration-300"
              >
                Back to Signup Form
              </button>
            </form>
          )}
          <p className="mt-8 text-center text-gray-700 text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
