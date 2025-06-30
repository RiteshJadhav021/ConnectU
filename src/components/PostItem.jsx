import React, { useState } from 'react';

const PostItem = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => setLikes(likes + 1);
  const handleComment = () => {
    if (commentText.trim()) {
      setComments([...comments, { id: Date.now(), user: 'You', text: commentText }]);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className={`font-semibold ${post.author.role === 'alumni' ? 'text-blue-700' : 'text-green-700'}`}>{post.author.name}</span>
        <span className="text-xs text-gray-400 ml-2">{post.createdAt}</span>
      </div>
      <div className="mb-4 text-gray-800">{post.content}</div>
      <div className="flex items-center gap-4 mb-2">
        <button onClick={handleLike} className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-2-2-2 2m0 6l2 2 2-2" /></svg>
          Like ({likes})
        </button>
      </div>
      <div className="mb-2">
        <input
          type="text"
          className="border rounded px-2 py-1 w-3/4 mr-2"
          placeholder="Add a comment..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <button onClick={handleComment} className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600">Comment</button>
      </div>
      <ul className="pl-2 mt-2 space-y-1">
        {comments.map(c => (
          <li key={c.id} className="text-sm text-gray-700"><span className="font-semibold text-indigo-700">{c.user}:</span> {c.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostItem;
