import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AlumniCard = ({ alumni, studentId }) => {
  // Debug log for props
  useEffect(() => {
    console.log("AlumniCard props:", { studentId, alumniId: alumni?._id, alumni });
  }, [studentId, alumni]);

  const navigate = useNavigate();

  const handleMessage = () => {
    // Navigate to ChatPage with alumniId (or any required params)
    navigate(`/chat/${alumni._id}`);
  };

  return (
    <div className="bg-white/80 rounded-2xl shadow-lg p-5 flex flex-col items-center gap-2 border border-cyan-100 hover:shadow-xl transition-all duration-200">
      <img src={alumni.img} alt={alumni.name} className="w-20 h-20 rounded-full object-cover border-4 border-cyan-200 mb-2" />
      <div className="font-bold text-lg text-indigo-700">{alumni.name}</div>
      <div className="flex flex-wrap gap-2 justify-center mb-1">
        {alumni.skills.map((skill, i) => (
          <span key={i} className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-semibold">{skill}</span>
        ))}
      </div>
      <div className="text-cyan-700 font-semibold text-sm">{alumni.company}</div>
      <div className="text-gray-600 text-sm text-center mt-1">{alumni.description}</div>
      {/* Message Button */}
      <div className="mt-2 w-full flex flex-col items-center">
        <button
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow transition-colors duration-150"
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
