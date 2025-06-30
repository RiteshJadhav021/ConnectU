import React, { useState } from 'react';

// Demo posts data with images
const demoPosts = [
  {
    id: 1,
    author: { name: 'Alumni: Priya Sharma', role: 'alumni' },
    content: 'Excited to announce a new internship opportunity at Google! Apply before July 15.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-06-28',
    likes: 12,
    comments: [
      { id: 1, user: 'Student: Rahul', text: 'Thank you for sharing!' }
    ]
  },
  {
    id: 2,
    author: { name: 'TPO: Mr. Verma', role: 'tpo' },
    content: 'Campus placement drive for Infosys on July 10. Register now!',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-06-27',
    likes: 8,
    comments: [
      { id: 1, user: 'Student: Asha', text: 'Looking forward to it!' }
    ]
  },
  {
    id: 3,
    author: { name: 'Alumni: Rohan Patel', role: 'alumni' },
    content: 'Sharing my experience at Microsoft. AMA!',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-06-25',
    likes: 5,
    comments: []
  }
];

const PostPage = () => {
  const [posts, setPosts] = useState(demoPosts.map(post => ({ ...post, showComments: false, commentText: '', likes: post.likes, comments: post.comments })));

  const handleLike = (postId) => {
    setPosts(posts => posts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
  };

  const handleComment = (postId) => {
    setPosts(posts => posts.map(post => {
      if (post.id === postId && post.commentText.trim()) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now(), user: 'You', text: post.commentText }],
          commentText: ''
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId) => {
    setPosts(posts => posts.map(post => post.id === postId ? { ...post, showComments: !post.showComments } : post));
  };

  const handleCommentInput = (postId, value) => {
    setPosts(posts => posts.map(post => post.id === postId ? { ...post, commentText: value } : post));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 flex flex-col gap-10">
      {posts.map(post => (
        <div key={post.id} className="p-6 bg-white rounded-xl shadow-md flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-blue-700">{post.author.name}</span>
              <span className="text-xs text-gray-400 ml-2">{post.createdAt}</span>
            </div>
            <div className="mb-4 text-gray-800">{post.content}</div>
            <img src={post.image} alt="Post" className="w-full rounded-lg mb-4" />
            <div className="flex items-center gap-6 mb-2">
              {/* Like Button */}
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow transition border-2 ${post.likes > demoPosts.find(p => p.id === post.id).likes ? 'bg-pink-100 border-pink-400 text-pink-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-400 hover:text-pink-600'}`}
                aria-label="Like"
              >
                <svg className={`w-7 h-7 transition-all duration-200 ${post.likes > demoPosts.find(p => p.id === post.id).likes ? 'scale-110' : ''}`} fill={post.likes > demoPosts.find(p => p.id === post.id).likes ? 'red' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16.5 8.5a3.5 3.5 0 00-5 0l-.5.5-.5-.5a3.5 3.5 0 00-5 5l.5.5L12 21l6.5-6.5.5-.5a3.5 3.5 0 00-5-5z" />
                </svg>
                <span className="font-semibold text-lg">{post.likes}</span>
                <span className="text-xs font-medium">Like</span>
              </button>
              {/* Comment Icon */}
              <button
                onClick={() => toggleComments(post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow transition border-2 ${post.showComments ? 'bg-blue-100 border-blue-400 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'}`}
                aria-label="Comments"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <span className="font-semibold text-lg">{post.comments.length}</span>
                <span className="text-xs font-medium">Comment</span>
              </button>
            </div>
          </div>
          {/* Comments Section (right side) */}
          {post.showComments && (
            <div className="w-full md:w-96 bg-white rounded-xl shadow-2xl p-4 flex flex-col border border-blue-200 animate-fadeIn">
              <h3 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Comments
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="border-2 border-blue-200 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Add a comment..."
                  value={post.commentText}
                  onChange={e => handleCommentInput(post.id, e.target.value)}
                />
                <button onClick={() => handleComment(post.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition">Post</button>
              </div>
              <ul className="pl-2 mt-2 space-y-3 overflow-y-auto max-h-72 custom-scrollbar">
                {post.comments.length === 0 ? (
                  <li className="text-gray-400 italic">No comments yet. Be the first to comment!</li>
                ) : (
                  post.comments.map(c => (
                    <li key={c.id} className="bg-blue-50 rounded-lg px-3 py-2 text-gray-800 shadow-sm">
                      <span className="font-semibold text-blue-700">{c.user}:</span> {c.text}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostPage;
