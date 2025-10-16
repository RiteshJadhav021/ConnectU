import React, { useState, useEffect } from "react";
import { FaUserCircle, FaBell, FaEnvelope } from "react-icons/fa";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 py-3 shadow-lg bg-white/80 backdrop-blur-lg sticky top-0 z-30">
        {/* Profile Icon (left) */}
        <button
          className="text-purple-700 hover:text-purple-900 text-4xl flex-1 flex items-center gap-2 justify-start"
          aria-label="Profile"
        >
          {teacher?.img ? (
            <img
              src={teacher.img}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-300 shadow"
            />
          ) : (
            <FaUserCircle />
          )}
          <span className="text-base font-semibold text-purple-800 hidden sm:inline">
            {teacher?.name || "Teacher"}
          </span>
        </button>

        {/* Centered Title */}
        <div className="flex-1 flex justify-center">
          <span className="text-xl font-bold text-purple-700">Teacher Dashboard</span>
        </div>

        {/* Right side: Posts Feed, Notifications, Messages */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full shadow transition flex items-center gap-2"
            onClick={() => window.location.href = '/alumni-posts'}
            aria-label="Posts Feed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
            </svg>
            Posts
          </button>
          <button
            className="text-purple-500 hover:text-purple-600 text-3xl relative"
            aria-label="Notifications"
          >
            <FaBell />
          </button>
          <button
            className="text-cyan-500 hover:text-cyan-700 text-3xl relative"
            aria-label="Messages"
          >
            <FaEnvelope />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">Welcome, {teacher?.name || "Teacher"}!</h1>
        <p className="text-lg text-purple-600 mb-8">Manage your classes and interact with students</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-purple-700 mb-2">My Classes</h3>
            <p className="text-gray-600">View and manage your assigned classes</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Student Progress</h3>
            <p className="text-gray-600">Track student performance and progress</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Posts & Updates</h3>
            <p className="text-gray-600">Stay updated with alumni and TPO posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
