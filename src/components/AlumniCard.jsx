import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AlumniCard = ({ alumni, studentId }) => {


  const navigate = useNavigate();

  const handleMessage = () => {
    // Navigate to ChatPage with alumniId (or any required params)
    navigate(`/chat/${alumni._id}`);
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center gap-2 border border-cyan-100 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300">
      <img src={alumni.img} alt={alumni.name} className="w-24 h-24 rounded-full object-cover border-4 border-cyan-200 mb-2 shadow-lg" />
      <div className="font-extrabold text-lg text-indigo-700">{alumni.name}</div>
      {alumni.skills && alumni.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-1">
          {alumni.skills.map((skill, i) => (
            <span key={i} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">{skill}</span>
          ))}
        </div>
      )}
      {alumni.company && <div className="text-cyan-700 font-bold text-sm">{alumni.company}</div>}
      {alumni.description && <div className="text-gray-600 text-sm text-center mt-1 leading-relaxed">{alumni.description}</div>}
      {/* Message Button */}
      <div className="mt-3 w-full flex flex-col items-center">
        <button
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={handleMessage}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          Message
        </button>
      </div>
    </div>
  );
};

export default AlumniCard;
