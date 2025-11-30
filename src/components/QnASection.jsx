import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

// Map frontend role to backend model enum
function mapRoleToModel(role) {
  if (!role) return 'User';
  const r = role.toLowerCase();
  if (r === 'student') return 'Student';
  if (r === 'alumni') return 'Alumni';
  if (r === 'teacher') return 'Teacher';
  if (r === 'tpo') return 'TPO';
  return 'User';
}

const QnASection = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [answerText, setAnswerText] = useState({}); // keyed by question _id
  const [postingQuestion, setPostingQuestion] = useState(false);
  const [postingAnswer, setPostingAnswer] = useState({}); // keyed by question _id

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
  })();
  const token = localStorage.getItem('token');

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/qna/questions?limit=100`);
      if (!res.ok) throw new Error('Failed to load questions');
      const data = await res.json();
      setQuestions(data);
    } catch (e) {
      setError(e.message || 'Error fetching questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleAsk = async () => {
    if (!storedUser) {
      setError('Login required to ask a question');
      return;
    }
    if (!newQuestion.trim()) return;
    setPostingQuestion(true);
    setError('');
    try {
      const body = {
        questionText: newQuestion.trim(),
        userId: storedUser._id,
        userName: storedUser.name || storedUser.fullName || storedUser.email || 'User',
        userImg: storedUser.profilePhoto || storedUser.photo || '',
        userModel: mapRoleToModel(storedUser.role)
      };
      const res = await fetch(`${API_BASE_URL}/qna/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post question');
      setQuestions(qs => [data, ...qs]);
      setNewQuestion('');
    } catch (e) {
      setError(e.message || 'Error posting question');
    } finally {
      setPostingQuestion(false);
    }
  };

  const handleAnswer = async (qid) => {
    if (!storedUser) {
      setError('Login required to answer');
      return;
    }
    const text = (answerText[qid] || '').trim();
    if (!text) return;
    setPostingAnswer(pa => ({ ...pa, [qid]: true }));
    setError('');
    try {
      const body = {
        text,
        userId: storedUser._id,
        userName: storedUser.name || storedUser.fullName || storedUser.email || 'User',
        userImg: storedUser.profilePhoto || storedUser.photo || '',
        userModel: mapRoleToModel(storedUser.role)
      };
      const res = await fetch(`${API_BASE_URL}/qna/questions/${qid}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post answer');
      // Replace updated question in local state
      setQuestions(qs => qs.map(q => q._id === data._id ? data : q));
      setAnswerText(at => ({ ...at, [qid]: '' }));
    } catch (e) {
      setError(e.message || 'Error posting answer');
    } finally {
      setPostingAnswer(pa => ({ ...pa, [qid]: false }));
    }
  };

  const roleBadge = (model) => {
    if (!model) return null;
    const base = model.toLowerCase();
    const colorMap = {
      student: 'bg-green-100 text-green-700 border-green-300',
      alumni: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      teacher: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      tpo: 'bg-pink-100 text-pink-700 border-pink-300',
      user: 'bg-gray-100 text-gray-600 border-gray-300'
    };
    const cls = colorMap[base] || colorMap.user;
    return <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full border ${cls}`}>{model}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto p-0 bg-transparent shadow-none">
      <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="border-2 border-indigo-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder={storedUser ? 'Ask a question...' : 'Login to ask a question'}
            value={newQuestion}
            disabled={!storedUser || postingQuestion}
            onChange={e => setNewQuestion(e.target.value)}
          />
          <button
            onClick={handleAsk}
            disabled={!storedUser || postingQuestion || !newQuestion.trim()}
            className={`px-4 py-2 rounded-lg font-semibold transition text-white ${(!storedUser || postingQuestion || !newQuestion.trim()) ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}
          >{postingQuestion ? 'Posting...' : 'Ask'}</button>
        </div>
        {error && <div className="mb-4 text-red-600 text-sm font-semibold">{error}</div>}
        {loading && <div className="text-sm text-gray-500 mb-4">Loading questions...</div>}
        {!loading && questions.length === 0 && <div className="text-gray-400 italic">No questions yet. Be the first to ask!</div>}
        <ul className="space-y-6">
          {questions.map(q => (
            <li key={q._id} className="bg-indigo-50 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-indigo-800 mb-2 flex items-center">
                <span className="text-gray-800">{q.questionText}</span>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                Asked by <span className="font-semibold">{q.askedByName}</span>
                {roleBadge(q.askedByModel)}
              </div>
              <ul className="pl-2 mb-2 space-y-1">
                {(!q.answers || q.answers.length === 0) ? (
                  <li className="text-gray-400 italic">No answers yet.</li>
                ) : (
                  q.answers.map(a => (
                    <li key={a._id} className="text-sm text-gray-700 flex">
                      <span className="font-semibold text-indigo-700 mr-1">{a.answeredByName}</span>
                      {roleBadge(a.answeredByModel)}
                      <span className="ml-2">{a.text}</span>
                    </li>
                  ))
                )}
              </ul>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  placeholder={!storedUser ? 'Login to answer' : 'Write an answer...'}
                  value={answerText[q._id] || ''}
                  disabled={!storedUser || postingAnswer[q._id]}
                  onChange={e => setAnswerText({ ...answerText, [q._id]: e.target.value })}
                />
                <button
                  onClick={() => handleAnswer(q._id)}
                  disabled={!storedUser || postingAnswer[q._id] || !(answerText[q._id] || '').trim()}
                  className={`px-3 py-1 rounded text-white font-medium ${( !storedUser || postingAnswer[q._id] || !(answerText[q._id]||'').trim()) ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                >{postingAnswer[q._id] ? 'Posting...' : 'Answer'}</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QnASection;
