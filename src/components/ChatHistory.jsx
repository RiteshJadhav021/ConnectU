import React from 'react';
import useChatHistory from './useChatHistory';

export default function ChatHistory({ studentId, alumniId, token }) {
  const { messages, loading, error } = useChatHistory(studentId, alumniId, token);

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!messages.length) return <div>No messages yet.</div>;

  return (
    <div style={{ maxHeight: 400, overflowY: 'auto', padding: 8 }}>
      {messages.map((msg) => (
        <div
          key={msg._id}
          style={{
            margin: '8px 0',
            textAlign: msg.fromUser === studentId ? 'right' : 'left',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: msg.fromUser === studentId ? '#dbeafe' : '#f1f5f9',
              color: '#222',
              borderRadius: 12,
              padding: '8px 16px',
              maxWidth: 300,
              wordBreak: 'break-word',
            }}
          >
            {msg.content}
            <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
