import React, { useState } from 'react';

// Demo Q&A data
const demoQuestions = [
  {
    id: 1,
    question: 'How to prepare for campus placements?',
    user: 'Student: Priya',
    answers: [
      { id: 1, user: 'Alumni: Rohan', text: 'Focus on aptitude and coding rounds. Practice mock interviews.' },
      { id: 2, user: 'TPO: Mr. Verma', text: 'Attend all placement training sessions and keep your resume updated.' }
    ]
  },
  {
    id: 2,
    question: 'What are the best resources for learning React?',
    user: 'Student: Amit',
    answers: [
      { id: 1, user: 'Teacher: Mrs. Sharma', text: 'Start with the official React docs and try building small projects.' }
    ]
  }
];

const QnASection = () => {
  const [questions, setQuestions] = useState(demoQuestions);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerText, setAnswerText] = useState({});

  const handleAsk = () => {
    if (newQuestion.trim()) {
      setQuestions([
        ...questions,
        { id: Date.now(), question: newQuestion, user: 'You', answers: [] }
      ]);
      setNewQuestion('');
    }
  };

  const handleAnswer = (qid) => {
    if (answerText[qid] && answerText[qid].trim()) {
      setQuestions(questions => questions.map(q =>
        q.id === qid
          ? { ...q, answers: [...q.answers, { id: Date.now(), user: 'You', text: answerText[qid] }] }
          : q
      ));
      setAnswerText({ ...answerText, [qid]: '' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-0 bg-transparent shadow-none">
      <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="border-2 border-indigo-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Ask a question..."
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
          />
          <button onClick={handleAsk} className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition">Ask</button>
        </div>
        <ul className="space-y-6">
          {questions.map(q => (
            <li key={q.id} className="bg-indigo-50 rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-indigo-800 mb-2">{q.user}: <span className="text-gray-800">{q.question}</span></div>
              <ul className="pl-2 mb-2 space-y-1">
                {q.answers.length === 0 ? (
                  <li className="text-gray-400 italic">No answers yet.</li>
                ) : (
                  q.answers.map(a => (
                    <li key={a.id} className="text-sm text-gray-700"><span className="font-semibold text-indigo-700">{a.user}:</span> {a.text}</li>
                  ))
                )}
              </ul>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Write an answer..."
                  value={answerText[q.id] || ''}
                  onChange={e => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                />
                <button onClick={() => handleAnswer(q.id)} className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600">Answer</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QnASection;
