import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({ _id: "", name: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setProfile(userObj);
    }
    // Fetch all posts
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/alumni/posts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch {}
    };
    fetchPosts();
  }, []);

  // Set background color for body
  useEffect(() => {
    const original = document.body.style.background;
    document.body.style.background =
      "linear-gradient(to bottom right, #e0e7ff,rgb(237, 238, 239),rgb(215, 222, 250))";
    return () => {
      document.body.style.background = original;
    };
  }, []);

  const handleDelete = (postId) => {
    toast.info(
      <div>
        <div className="mb-2">Are you sure you want to delete this post?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            onClick={async () => {
              toast.dismiss();
              try {
                const res = await fetch(
                  `${API_BASE_URL}/alumni/posts/${postId}`,
                  {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  }
                );
                if (res.ok) {
                  setPosts((prev) => prev.filter((p) => p._id !== postId));
                  toast.success("Post deleted successfully!");
                } else {
                  toast.error("Failed to delete post");
                }
              } catch {
                toast.error("Failed to delete post");
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

  const myPosts = posts.filter(
    (post) => post.author && post.author._id === profile._id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-300 flex flex-col items-center">
      <div className="w-full max-w-2xl mt-8 flex flex-col gap-8">
        <button
          className="mb-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow self-start"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">My Posts</h2>
        {myPosts.length === 0 ? (
          <div className="text-gray-500 text-center">No posts found.</div>
        ) : (
          myPosts.map((post, idx) => (
            <div
              key={post._id || idx}
              className="bg-white rounded-2xl shadow p-6 border border-gray-100 relative"
            >
              <button
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold z-10"
                onClick={() => handleDelete(post._id)}
                title="Delete Post"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-indigo-700">
                  {profile.name}
                </span>
                <span className="text-gray-400 text-xs">
                  {post.createdAt ? post.createdAt.slice(0, 10) : ""}
                </span>
              </div>
              <div className="mb-2 text-gray-800">{post.content}</div>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full rounded-xl mb-2"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPosts;
