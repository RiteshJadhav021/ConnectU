import React, { useState } from "react";
import { Link } from "react-router-dom";

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

  const handleChange = (e) => {
    if (e.target.name === "name") {
      const value = e.target.value;
      if (value && value !== value.toUpperCase()) {
        setNameError("Name should be in capital letters");
      } else {
        setNameError("");
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen flex mt-20 bg-gradient-to-br from-indigo-200 via-white to-cyan-200">
      {/* Left Side: Project Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src="/pexels-pixabay-326235.jpg"
          alt="Signup Visual"
          className="object-cover w-full h-full rounded-l-3xl shadow-2xl"
        />
      </div>
      {/* Right Side: Signup Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-2 py-4 md:px-4 md:py-8">
        <div className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-lg">
            Sign Up
          </h2>
          <p className="text-center text-indigo-800 text-xl mb-8 font-bold drop-shadow-md tracking-wide">
            Create your account on{" "}
            <span className="text-cyan-600">ConnectU</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Role
              </label>
              <select
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
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Enter Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
              />
              {nameError && (
                <p className="text-red-600 text-sm font-semibold mt-1">
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
                  type="text"
                  name="prn"
                  value={form.prn}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
                />
                {prnError && (
                  <p className="text-red-600 text-sm font-semibold mt-1">
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
                  type="text"
                  name="passout"
                  value={form.passout}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 text-lg"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Email ID
              </label>
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
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Password
              </label>
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
              Sign Up
            </button>
          </form>
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
