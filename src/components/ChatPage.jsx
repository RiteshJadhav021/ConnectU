import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { socket } from "../socket";
import ChatHistory from './ChatHistory';
import { API_BASE_URL } from "../config";

const ChatPage = () => {
  const { alumniId, studentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if this is alumni chatting with student or student chatting with alumni
  const isAlumniChatMode = location.pathname.includes('/alumni-chat/');
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = currentUser?._id;
  const otherUserId = isAlumniChatMode ? studentId : alumniId;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [alumni, setAlumni] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Unique room for student-alumni pair
  const roomId = currentUserId && otherUserId ? [currentUserId, otherUserId].sort().join("-") : null;

  // Fetch other user info based on chat mode
  useEffect(() => {
    if (isAlumniChatMode && studentId) {
      // Alumni chatting with student - fetch student info
      fetch(`${API_BASE_URL}/students/${studentId}`)
        .then(res => res.json())
        .then(setStudentProfile)
        .catch(() => setStudentProfile(null));
    } else if (!isAlumniChatMode && alumniId) {
      // Student chatting with alumni - fetch alumni info
      fetch(`${API_BASE_URL}/alumni/${alumniId}`)
        .then(res => res.json())
        .then(setAlumni)
        .catch(() => setAlumni(null));
    }
  }, [isAlumniChatMode, studentId, alumniId]);

  // Fetch messages (initial load)
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;
    
    // Determine the correct studentId and alumniId for the API call
    let apiStudentId, apiAlumniId;
    if (isAlumniChatMode) {
      apiStudentId = studentId;
      apiAlumniId = currentUserId;
    } else {
      apiStudentId = currentUserId;
      apiAlumniId = alumniId;
    }
    
    fetch(`${API_BASE_URL}/messages/conversation/${apiStudentId}/${apiAlumniId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => res.ok ? res.json() : [])
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [currentUserId, otherUserId, isAlumniChatMode, studentId, alumniId, token]);

  // Socket.io: join room and listen for messages
  useEffect(() => {
    if (!roomId) return;
    socket.connect();
    socket.emit("joinRoom", roomId);
    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [roomId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Open modal if ?modal=open in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("modal") === "open") {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [location.search]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Validate MongoDB ObjectId (24 hex chars)
    const isValidObjectId = (id) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
    
    // Validate current user and target user
    if (!isValidObjectId(currentUserId)) {
      alert("Invalid current user. Please login again.");
      return;
    }
    
    if (!isValidObjectId(otherUserId)) {
      alert("Invalid chat target. Please try again.");
      return;
    }
    
    // Determine correct fromUser and toUser based on chat mode
    let fromUser, toUser;
    if (isAlumniChatMode) {
      fromUser = currentUserId; // Alumni
      toUser = studentId; // Student
    } else {
      fromUser = currentUserId; // Student
      toUser = alumniId; // Alumni
    }
    
    const msg = {
      fromUser,
      toUser,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setInput("");
    try {
      // Save to backend first
      const res = await fetch(`${API_BASE_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to save message:", res.status, errorText);
        alert(`Failed to send message. Server responded with status ${res.status}: ${errorText}`);
        return;
      }
      const savedMsg = await res.json();
      // Send via Socket.io
      socket.emit("sendMessage", { roomId, message: savedMsg });
      setMessages(prev => [...prev, savedMsg]);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please check the console for details.");
    }
  };

  // Defensive: check for valid IDs based on chat mode
  const isValidObjectId = (id) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
  
  // Validate current user ID
  if (!isValidObjectId(currentUserId)) {
    return <div className="text-red-500 text-center mt-10">Invalid user session. Please login again.</div>;
  }
  
  // Validate other user ID based on chat mode
  if (!isValidObjectId(otherUserId)) {
    return <div className="text-red-500 text-center mt-10">Invalid chat target. Please try again.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-cyan-200 flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-cyan-100 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-t-2xl">
          {/* Dynamic profile display based on chat mode */}
          {(() => {
            const otherUser = isAlumniChatMode ? studentProfile : alumni;
            const otherUserName = isAlumniChatMode ? (studentProfile?.name || "Student") : (alumni?.name || "Alumni");
            const otherUserImg = isAlumniChatMode ? studentProfile?.img : alumni?.img;
            const otherUserInfo = isAlumniChatMode ? (studentProfile?.course || "Student") : (alumni?.company || "Alumni");
            
            return (
              <>
                {otherUserImg ? (
                  <img 
                    src={otherUserImg} 
                    alt={otherUserName} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold border-2 border-cyan-400"
                  style={{ display: otherUserImg ? 'none' : 'flex' }}
                >
                  {otherUserName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-lg text-cyan-800">{otherUserName}</div>
                  <div className="text-sm text-gray-500">{otherUserInfo}</div>
                </div>
              </>
            );
          })()}
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-cyan-50">
          {loading ? (
            <div className="text-center text-cyan-500">Loading messages...</div>
          ) : Array.isArray(messages) && messages.length === 0 ? (
            <div className="text-center text-gray-400">No messages yet. Say hello!</div>
          ) : (
            Array.isArray(messages) && messages.map((msg, idx) => {
              const isCurrentUser = msg.fromUser === currentUserId;
              
              // Determine sender info based on chat mode and message direction
              let senderName, senderImg;
              if (isCurrentUser) {
                // Current user (me) - either alumni or student
                senderName = currentUser?.name || "You";
                senderImg = currentUser?.img;
              } else {
                // Other user - either student or alumni depending on chat mode
                if (isAlumniChatMode) {
                  // Alumni chatting with student, other user is student
                  senderName = studentProfile?.name || "Student";
                  senderImg = studentProfile?.img;
                } else {
                  // Student chatting with alumni, other user is alumni
                  senderName = alumni?.name || "Alumni";
                  senderImg = alumni?.img;
                }
              }
              
              return (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${isCurrentUser ? "justify-end flex-row-reverse" : "justify-start"}`}
                >
                  {/* Profile Photo */}
                  <div className="flex-shrink-0">
                    {senderImg ? (
                      <img
                        src={senderImg}
                        alt={senderName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-cyan-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-cyan-300"
                      style={{ display: senderImg ? 'none' : 'flex' }}
                    >
                      {senderName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="flex flex-col max-w-xs">
                    {/* Sender Name */}
                    <div className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                      {senderName}
                    </div>
                    
                    {/* Message Content */}
                    <div
                      className={`px-4 py-2 rounded-2xl shadow text-sm ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      {msg.content}
                      <div className={`text-[10px] mt-1 ${isCurrentUser ? "text-cyan-100" : "text-gray-400"} text-right`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-cyan-100 bg-white rounded-b-2xl flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full shadow hover:from-cyan-600 hover:to-blue-600 transition-all"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </div>
      {showModal && (
        <Modal onClose={() => { setShowModal(false); navigate(`/chat/${alumniId}`); }} title={`Chat with ${alumni?.name || "Alumni"}`}>
          {/* Modal content: Chat UI */}
          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto space-y-3 mb-2">
              {loading ? (
                <div className="text-center text-cyan-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400">No messages yet. Say hello!</div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.fromUser === studentId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
                        msg.fromUser === studentId
                          ? "bg-cyan-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                      <div className="text-[10px] text-right text-gray-300 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 mt-auto">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-cyan-50"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full shadow hover:from-cyan-600 hover:to-blue-600 transition-all"
                disabled={!input.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </Modal>
      )}
      {/* Remove duplicate ChatHistory if you already render messages above */}
      {/* <ChatHistory studentId={studentId} alumniId={alumniId} token={token} /> */}
    </div>
  );
};

export default ChatPage;
