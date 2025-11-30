import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";

const AlumniPostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [student, setStudent] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch all posts (Alumni + TPO) from the TPO endpoint which returns all posts
        const res = await fetch(`${API_BASE_URL}/tpo/posts`, {
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
    if (!student?._id) {
      toast.error("You must be logged in to like a post.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/student/posts/${postId}/like`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts => posts.map(post =>
          post._id === postId ? { ...post, likes: data.likes, likedBy: data.likedBy } : post
        ));
        toast.success(data.message);
      } else {
        toast.error(data.error || "Failed to like post");
      }
    } catch (err) {
      toast.error("Failed to like post");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }
    if (commentText.trim().length > 500) {
      toast.error("Comment must be 500 characters or less");
      return;
    }
    if (!student?._id) {
      toast.error("You must be logged in to comment");
      return;
    }

    setCommentLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/student/posts/${activeCommentPost}/comment`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts => posts.map(post =>
          post._id === activeCommentPost 
            ? { ...post, comments: [...(post.comments || []), data.comment] } 
            : post
        ));
        setCommentText("");
        toast.success("Comment added successfully");
      } else {
        toast.error(data.error || "Failed to add comment");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/student/posts/${postId}/comment/${commentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(posts => posts.map(post =>
          post._id === postId 
            ? { ...post, comments: post.comments.filter(c => c._id !== commentId) } 
            : post
        ));
        toast.success("Comment deleted");
      } else {
        toast.error(data.error || "Failed to delete comment");
      }
    } catch (err) {
      toast.error("Failed to delete comment");
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
              const userId = student?._id;
              const hasLiked = post.likedBy && userId && post.likedBy.includes(userId);
              return (
                <button
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all duration-200 ${
                    hasLiked 
                      ? 'bg-red-100 text-red-500 border-red-300 hover:bg-red-50' 
                      : 'text-gray-600 border-gray-200 hover:text-red-500 hover:border-red-300 hover:bg-red-50'
                  }`}
                  onClick={() => handleLike(post._id)}
                  title={hasLiked ? 'Unlike this post' : 'Like this post'}
                >
                  <span className="text-lg">{hasLiked ? '♥' : '♡'}</span> 
                  <span className="font-semibold">{post.likes || 0}</span>
                </button>
              );
            })()}
            <button 
              className="flex items-center gap-1 text-gray-600 hover:text-blue-500 hover:bg-blue-50 px-3 py-1 rounded-full border border-gray-200 transition-all duration-200"
              onClick={() => setActiveCommentPost(post._id)}
            >
              <span className="text-lg">💬</span> 
              <span className="font-semibold">{post.comments ? post.comments.length : 0}</span>
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
              Comments ({posts.find(p => p._id === activeCommentPost)?.comments?.length || 0})
            </h3>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2">
                <textarea
                  className="border-2 border-blue-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows="2"
                  maxLength="500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                />
                <button 
                  onClick={handleCommentSubmit} 
                  disabled={commentLoading || !commentText.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed h-fit"
                >
                  {commentLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
              <div className="text-xs text-gray-500 text-right">
                {commentText.length}/500 characters
              </div>
            </div>
            <ul className="pl-2 mt-2 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
              {(posts.find(p => p._id === activeCommentPost)?.comments || []).length === 0 ? (
                <li className="text-gray-400 italic text-center mt-8">No comments yet. Be the first to comment!</li>
              ) : (
                posts.find(p => p._id === activeCommentPost).comments.map((c, idx) => (
                  <li key={c._id || idx} className="bg-blue-50 rounded-lg px-3 py-3 text-gray-800 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-2">
                      {c.userImg ? (
                        <img src={c.userImg} alt={c.user} className="w-8 h-8 rounded-full object-cover border-2 border-blue-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 flex items-center justify-center text-white text-sm font-bold">
                          {c.user ? c.user.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-700">{c.user}</span>
                          {c.userId === student?._id && (
                            <button
                              onClick={() => handleDeleteComment(activeCommentPost, c._id)}
                              className="text-xs text-red-500 hover:text-red-700 font-semibold"
                              title="Delete comment"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mt-1">{c.text}</p>
                        {c.createdAt && (
                          <span className="text-xs text-gray-400 mt-1 block">
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
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
