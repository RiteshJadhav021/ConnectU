import React, { useEffect, useState } from "react";

const AlumniPostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/alumni/posts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch {}
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-8 text-indigo-600 font-semibold">Loading alumni posts...</div>;
  if (!posts.length) return <div className="text-center py-8 text-gray-500">No alumni posts found.</div>;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 my-8">
      {posts.map((post, idx) => (
        <div key={post._id || idx} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-indigo-700">Alumni: {post.author && post.author.name ? post.author.name : 'Unknown'}</span>
            <span className="text-gray-400 text-xs">{post.createdAt ? post.createdAt.slice(0, 10) : ''}</span>
          </div>
          <div className="mb-2 text-gray-800">{post.content}</div>
          {post.image && (
            <img src={post.image} alt="Post" className="w-full rounded-xl mb-2" />
          )}
          <div className="flex gap-4 mt-2">
            <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 px-3 py-1 rounded-full border border-gray-200" disabled>
              <span>♡</span> <span>{post.likes || 0} Like</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 px-3 py-1 rounded-full border border-gray-200" disabled>
              <span>💬</span> <span>{post.comments ? post.comments.length : 0} Comment</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlumniPostFeed;
