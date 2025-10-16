import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from "../config";

const PostModal = ({ show, onClose, onPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!show) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post content is required');
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);
      const res = await fetch('`${API_BASE_URL}/alumni/posts', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to post');
      const post = await res.json();
      toast.success('Post shared!');
      setContent('');
      setImage(null);
      setPreview(null);
      onPost(post);
      onClose();
    } catch (err) {
      toast.error('Failed to share post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeInUp border-2 border-indigo-200 flex flex-col gap-4"
        style={{ minWidth: 320, maxWidth: 480 }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none z-10"
          onClick={onClose}
          aria-label="Close Post Modal"
          type="button"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Share a Post</h2>
        <textarea
          className="border rounded-lg px-3 py-2 w-full min-h-[80px] focus:outline-indigo-400"
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={uploading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
        />
        {preview && (
          <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded-lg border mb-2" />
        )}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow transition duration-200 text-base mt-2"
          disabled={uploading}
        >
          {uploading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default PostModal;
