import React from "react";

const AlumniCard = ({ alumni }) => (
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
  </div>
);

export default AlumniCard;
