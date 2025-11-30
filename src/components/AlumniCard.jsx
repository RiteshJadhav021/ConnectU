import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AlumniCard = ({ alumni, studentId, connectionStatus, onRequestSent }) => {
  const navigate = useNavigate();

  const handleMessage = () => {
    // Navigate to ChatPage with alumniId (or any required params)
    navigate(`/chat/${alumni._id}`);
  };

  const handleConnect = () => {
    if (onRequestSent) {
      onRequestSent(alumni._id, 'pending');
    }
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
      
      {/* Action Buttons - Show based on connection status */}
      <div className="mt-3 w-full flex flex-col items-center">
        {connectionStatus === 'accepted' ? (
          // Show Message button only if connection is accepted
          <button
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleMessage}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Message
          </button>
        ) : connectionStatus === 'pending' ? (
          // Show Pending button if request is pending
          <button
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400 text-white font-bold text-sm shadow-lg cursor-not-allowed"
            disabled
          >
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Pending
          </button>
        ) : connectionStatus === 'rejected' ? (
          // Show Rejected status and allow retry
          <div className="flex flex-col gap-2 w-full items-center">
            <button
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white font-bold text-sm shadow-lg cursor-not-allowed"
              disabled
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Rejected
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-xs shadow hover:shadow-lg transition-all duration-200"
              onClick={handleConnect}
            >
              Try Again
            </button>
          </div>
        ) : (
          // Show Connect button if no connection exists
          <button
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleConnect}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;
