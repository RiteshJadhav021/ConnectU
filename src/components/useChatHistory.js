import { useEffect, useState } from 'react';

// Custom React hook to fetch chat history between student and alumni
export default function useChatHistory(studentId, alumniId, token) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId || !alumniId || !token) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/message/conversation/${studentId}/${alumniId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
      })
      .then(setMessages)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId, alumniId, token]);

  return { messages, loading, error };
}
