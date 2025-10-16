import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AlumniMyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('`${API_BASE_URL}/alumni/posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Only show posts by current alumni
          const user = localStorage.getItem('user');
          let userId = "";
          if (user) {
            try {
              userId = JSON.parse(user)._id;
            } catch {}
          }
          const myPosts = data.filter(post => post.author && post.author._id === userId);
          setPosts(myPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch {}
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleDeletePost = (postId) => {
    toast.info(
      <div>
        <div className="mb-2">Are you sure you want to delete this post?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            onClick={async () => {
              toast.dismiss();
              try {
                const res = await fetch(`${API_BASE_URL}/alumni/posts/${postId}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.ok) {
                  setPosts((prev) => prev.filter((p) => p._id !== postId));
                  toast.success('Post deleted successfully!');
                } else {
                  const data = await res.json();
                  toast.error(data.error || 'Failed to delete post.');
                }
              } catch {
                toast.error('Failed to delete post.');
              }
            }}
          >
            Confirm
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 via-white to-orange-100 items-center">
      <div className="w-full max-w-xl mt-12 p-6 bg-white rounded-2xl shadow-xl border border-yellow-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">My Posts</h2>
          <button className="text-gray-400 hover:text-indigo-600 text-xl font-bold" onClick={() => navigate(-1)} aria-label="Back">×</button>
        </div>
        {loading ? (
          <div className="text-yellow-600">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400">No posts yet.</div>
        ) : (
          <ul className="divide-y">
            {posts.map(post => (
              <li key={post._id} className="py-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-700">{post.content}</span>
                  <button
                    className="ml-auto text-red-500 hover:text-red-700 text-xl p-1 rounded-full"
                    title="Delete Post"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
                <span className="text-gray-400 text-xs">{post.createdAt ? post.createdAt.slice(0, 10) : ''}</span>
                {post.image && (
                  <img src={post.image} alt="Post" className="w-full rounded-xl mb-2" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlumniMyPosts;
