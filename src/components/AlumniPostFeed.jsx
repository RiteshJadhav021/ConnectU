import React, { useEffect, useState } from "react";

const AlumniPostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [student, setStudent] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch all posts (Alumni + TPO) from the TPO endpoint which returns all posts
        const res = await fetch("http://localhost:5000/api/tpo/posts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Sort posts by createdAt descending (newest first)
          const sortedPosts = [...data].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          });
          setPosts(sortedPosts);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    if (!student) {
      alert("You must be logged in to like a post.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/tpo/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: student.email || student._id || student.id })
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(posts => posts.map(post =>
          post._id === postId ? { ...post, likes: data.likes, likedBy: data.likedBy } : post
        ));
      }
    } catch (err) {
      alert("Failed to like post");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tpo/posts/${activeCommentPost}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: student?.name || "Anonymous",
          text: commentText
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(posts => posts.map(post =>
          post._id === activeCommentPost ? { ...post, comments: data.comments } : post
        ));
        setCommentText("");
      }
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  if (loading) return <div className="text-center py-8 text-indigo-600 font-semibold">Loading alumni posts...</div>;
  if (!posts.length) return <div className="text-center py-8 text-gray-500">No alumni posts found.</div>;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 my-8 relative">
      {posts.map((post, idx) => (
        <div key={post._id || idx} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-indigo-700">
              {post.authorModel === 'Alumni' 
                ? `Alumni: ${post.author && post.author.name ? post.author.name : 'Unknown Alumni'}`
                : post.authorModel === 'TPO' 
                  ? `TPO: ${post.author && post.author.name ? post.author.name : 'TPO'}`
                  : 'Unknown'}
            </span>
            <span className="text-gray-400 text-xs">{post.createdAt ? post.createdAt.slice(0, 10) : ''}</span>
          </div>
          <div className="mb-2 text-gray-800">{post.content}</div>
          {post.image && (
            <img src={post.image} alt="Post" className="w-full rounded-xl mb-2" />
          )}
          <div className="flex gap-4 mt-2">
            {(() => {
              const userId = student?.email || student?._id || student?.id;
              const hasLiked = post.likedBy && userId && post.likedBy.includes(userId);
              return (
                <button
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 ${hasLiked ? 'bg-red-100 text-red-500 cursor-not-allowed' : 'text-gray-600 hover:text-red-500'}`}
                  onClick={() => !hasLiked && handleLike(post._id)}
                  disabled={hasLiked}
                  title={hasLiked ? 'You have already liked this post' : 'Like this post'}
                >
                  <span>{hasLiked ? '♥' : '♡'}</span> <span>{post.likes || 0} Like</span>
                </button>
              );
            })()}
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 px-3 py-1 rounded-full border border-gray-200"
              onClick={() => setActiveCommentPost(post._id)}>
              <span>💬</span> <span>{post.comments ? post.comments.length : 0} Comment</span>
            </button>
          </div>
        </div>
      ))}
      {/* Right-side Comment Box */}
      {activeCommentPost && (
        <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl border-l border-blue-200 z-50 flex flex-col animate-slideInRight">
          <button className="self-end m-4 text-2xl text-gray-400 hover:text-red-500 font-bold" onClick={() => setActiveCommentPost(null)} aria-label="Close Comments">×</button>
          <div className="p-6 flex-1 flex flex-col">
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
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <button onClick={handleCommentSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition">Post</button>
            </div>
            <ul className="pl-2 mt-2 space-y-3 overflow-y-auto max-h-72 custom-scrollbar">
              {(posts.find(p => p._id === activeCommentPost)?.comments || []).length === 0 ? (
                <li className="text-gray-400 italic">No comments yet. Be the first to comment!</li>
              ) : (
                posts.find(p => p._id === activeCommentPost).comments.map(c => (
                  <li key={c.id} className="bg-blue-50 rounded-lg px-3 py-2 text-gray-800 shadow-sm">
                    <span className="font-semibold text-blue-700">{c.user}:</span> {c.text}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniPostFeed;
