import React from "react";

const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full relative animate-fadeInUp border-2 border-indigo-200">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none z-10"
        onClick={onClose}
        aria-label="Close Modal"
      >
        ×
      </button>
      {title && (
        <div className="px-8 pt-8 pb-2 text-xl font-bold text-indigo-700 text-center">{title}</div>
      )}
      <div className="px-8 pb-8 pt-2">{children}</div>
    </div>
  </div>
);

export default Modal;
