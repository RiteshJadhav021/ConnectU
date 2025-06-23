import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
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
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
              />
            </div>
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
