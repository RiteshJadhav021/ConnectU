import React from "react";

const MessageBox = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-fadeInUp">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close message box"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-indigo-700 mb-4">Messages</h3>
        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
          {/* Example messages */}
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 rounded-full bg-cyan-200" />
            <div className="bg-cyan-100 rounded-xl px-4 py-2 text-gray-800">Hi! How can I help you?</div>
          </div>
          <div className="flex items-start gap-2 self-end">
            <div className="bg-indigo-100 rounded-xl px-4 py-2 text-gray-800">I want to know about your company.</div>
            <div className="w-10 h-10 rounded-full bg-indigo-200" />
          </div>
        </div>
        <form className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-cyan-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-4 py-2 font-bold shadow">Send</button>
        </form>
      </div>
      <style>{`
        .animate-fadeInUp { animation: fadeInUp 0.4s cubic-bezier(.23,1.02,.58,.99) both; }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MessageBox;
