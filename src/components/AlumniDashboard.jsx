import React, { useState, useEffect } from "react";
import { FaUserCircle, FaTrash, FaBell, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AlumniDashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    skills: [],
    company: "",
    description: "",
    img: ""
  });
  const [skillInput, setSkillInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [postDescription, setPostDescription] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState("");
  const [posting, setPosting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [alumni, setAlumni] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [hasUnseenRequests, setHasUnseenRequests] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [showMessages, setShowMessages] = useState(false);
  const [alumniIds, setAlumniIds] = useState([]);
  const navigate = useNavigate();

  // Fetch alumni data on mount (from localStorage or API)
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/alumni/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setProfile(prev => ({ ...prev, ...data }));
            localStorage.setItem('user', JSON.stringify(data));
            return;
          }
        } catch {}
      }
      // fallback to localStorage if fetch fails
      const user = localStorage.getItem('user');
      if (user) {
        setProfile(prev => ({ ...prev, ...JSON.parse(user) }));
      }
    };
    fetchProfile();
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch all posts from TPO endpoint (returns all posts: Alumni + TPO)
        const res = await fetch('`${API_BASE_URL}/tpo/posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Sort posts by createdAt descending
          const sortedPosts = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(sortedPosts);
        }
      } catch {}
    };
    fetchPosts();
  }, []);

  // Fetch pending connection requests for this alumni
  useEffect(() => {
    if (!profile?._id) return;
    fetch(`${API_BASE_URL}/connections/received/${profile._id}`)
      .then(res => res.json())
      .then(data => {
        setPendingRequests(data || []);
        setHasUnseenRequests((data || []).some(r => !r.seenByAlumni));
      })
      .catch(() => setPendingRequests([]));
  }, [profile?._id]);

  // Fetch all alumni IDs on mount
  useEffect(() => {
    fetch('`${API_BASE_URL}/alumni/all-ids')
      .then(res => res.json())
      .then(ids => setAlumniIds(ids.map(id => id.toString())))
      .catch(() => setAlumniIds([]));
  }, []);

  // Fetch conversations for this alumni (group by student, get latest message)
  useEffect(() => {
    if (!profile?._id || !alumniIds) return;
    setLoadingConversations(true);
    fetch(`${API_BASE_URL}/messages/alumni/${profile._id}`)
      .then(res => res.json())
      .then(async data => {
        // Group messages by studentId using fromUser/toUser
        const studentConvs = {};
        for (const msg of data) {
          // Determine the other user
          const otherId = String(msg.fromUser) === String(profile._id) ? String(msg.toUser) : String(msg.fromUser);
          // Only include if the other user is NOT an alumni
          if (!alumniIds.map(String).includes(otherId)) {
            if (!studentConvs[otherId]) studentConvs[otherId] = [];
            studentConvs[otherId].push(msg);
          }
        }
        // For each student, get latest message
        const convs = Object.entries(studentConvs).map(([studentId, msgs]) => {
          const sorted = msgs.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
          return {
            studentId,
            lastMessage: sorted[0],
          };
        });
        // Fetch student details for each studentId (force ObjectId string)
        const detailsPromises = convs.map(async conv => {
          try {
            const res = await fetch(`${API_BASE_URL}/students/${conv.studentId}`);
            if (res.ok) {
              const student = await res.json();
              return {
                ...conv,
                studentName: student.name || 'Unknown',
                studentImg: student.img && student.img.length > 0 ? student.img : '/default-avatar.png',
              };
            } else {
              return {
                ...conv,
                studentName: 'Unknown',
                studentImg: '/default-avatar.png',
              };
            }
          } catch (error) {
            return {
              ...conv,
              studentName: 'Unknown',
              studentImg: '/default-avatar.png',
            };
          }
        });
        const convsWithDetails = await Promise.all(detailsPromises);
        setConversations(convsWithDetails);
        setLoadingConversations(false);
      })
      .catch((error) => {
        setConversations([]);
        setLoadingConversations(false);
      });
  }, [profile?._id, alumniIds]);

  // Handle adding a skill
  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (!newSkill) return;
    if (newSkill.includes(",") || newSkill.includes(" ")) {
      toast.error('Please add only one skill at a time (no commas or spaces).');
      return;
    }
    if (profile.skills.includes(newSkill)) {
      toast.error('Skill already added.');
      return;
    }
    setProfile({ ...profile, skills: [...profile.skills, newSkill] });
    setSkillInput("");
  };
  // Handle removing a skill
  const removeSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };
  // Helper to validate company input
  const validateCompany = (company) => {
    const trimmed = company.trim();
    if (!trimmed) return false;
    if (trimmed.includes(",") || trimmed.includes(" ")) {
      toast.error('Please enter only one company (no commas or spaces).');
      return false;
    }
    return true;
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!profile.company.trim()) {
      toast.error('Company is required.');
      return;
    }
    if (!validateCompany(profile.company)) {
      return;
    }
    if (!profile.description.trim()) {
      toast.error('Description is required.');
      return;
    }
    if (!profile.skills || profile.skills.length === 0) {
      toast.error('Please add at least one skill.');
      return;
    }
    // Skill should not be user's name
    const nameLower = profile.name.trim().toLowerCase();
    for (const skill of profile.skills) {
      if (skill.trim().toLowerCase() === nameLower) {
        toast.error('Skill cannot be your name.');
        return;
      }
    }
    // Save profile data to localStorage (including img)
    localStorage.setItem('user', JSON.stringify(profile));
    // Send profile data to backend
    try {
      const token = localStorage.getItem('token');
      await fetch('`${API_BASE_URL}/alumni/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name, // Added name field
          skills: profile.skills,
          company: profile.company,
          description: profile.description,
          img: profile.img,
        }),
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile on server');
    }
    setShowEditProfile(false);
    setShowProfileMenu(false);
    // Optionally show a success message
  };

  // Handle photo upload to backend (like student dashboard)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/alumni/me/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProfile((prev) => ({ ...prev, img: data.url }));
        // Update localStorage
        const user = localStorage.getItem('user');
        if (user) {
          const userObj = JSON.parse(user);
          userObj.img = data.url;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
        // Optionally auto-save or show a success message
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Handle post image selection
  const handlePostImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
      setPostImagePreview(URL.createObjectURL(file));
    }
  };

  // Cloudinary config
  const CLOUDINARY_UPLOAD_PRESET = 'unsigned'; // Default unsigned preset, change if you have a custom one
  const CLOUDINARY_CLOUD_NAME = 'dlbyu8g36'; // Your Cloudinary cloud name

  // Handle sending post
  const handleSendPost = async () => {
    if (!postDescription.trim()) {
      toast.error('Description is required.');
      return;
    }
    setPosting(true);
    const formData = new FormData();
    formData.append('content', postDescription); // Use 'content' as required by backend
    if (postImage) formData.append('image', postImage); // Send the file, not the URL

    try {
      const res = await fetch('`${API_BASE_URL}/alumni/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (res.ok) {
        // Fetch all posts again from TPO endpoint to show all posts
        const postsRes = await fetch('`${API_BASE_URL}/tpo/posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (postsRes.ok) {
          const data = await postsRes.json();
          // Sort posts by createdAt descending
          const sortedPosts = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(sortedPosts);
        }
        setShowPostModal(false);
        setPostDescription("");
        setPostImage(null);
        setPostImagePreview("");
        toast.success('Post created!');
      } else {
        let errorText = '';
        try {
          const errorData = await res.json();
          errorText = errorData.error || JSON.stringify(errorData);
        } catch (e) {
          errorText = await res.text();
        }
        console.error('Failed to create post:', errorText, 'Status:', res.status);
        toast.error(`Failed to create post. Status: ${res.status}. ${errorText}`);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Failed to create post.');
    }
    setPosting(false);
  };

  // Helper: check if post belongs to current user
  const isMyPost = (post) => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    try {
      const userObj = JSON.parse(user);
      return post.author && post.author._id === userObj._id;
    } catch {
      return false;
    }
  };

  // Delete post with Toastify confirmation
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

  // Like a post (persistent, only once per user)
  const handleLike = async (postId) => {
    if (!alumni) {
      alert("You must be logged in to like a post.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/alumni/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: alumni.email || alumni._id || alumni.id })
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(posts => {
          // Update the liked post
          const updatedPosts = posts.map(post =>
            post._id === postId ? { ...post, likes: data.likes, likedBy: data.likedBy } : post
          );
          // Sort by createdAt descending
          return [...updatedPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
      }
    } catch (err) {
      alert("Failed to like post");
    }
  };

  // Comment on a post (persistent)
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/alumni/posts/${activeCommentPost}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: alumni?.name || "Alumni",
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

  // Mark requests as seen
  const markRequestsSeen = () => {
    if (!profile?._id) return;
    fetch(`${API_BASE_URL}/connections/notifications/alumni/${profile._id}/seen`, { method: "POST" })
      .then(() => setHasUnseenRequests(false))
      .catch(() => {});
  };

  // Accept/Reject request
  const handleRespond = (requestId, action) => {
    fetch(`${API_BASE_URL}/connections/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action }),
    })
      .then(res => res.json())
      .then(() => {
        setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 via-white to-orange-100">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 py-3 shadow-lg bg-white/80 backdrop-blur-lg sticky top-0 z-30">
        {/* Profile Icon (left) */}
        <button
          className="text-yellow-700 hover:text-yellow-900 text-4xl flex-1 flex items-center gap-2 justify-start"
          aria-label="Profile"
          onClick={() => setShowProfileMenu(true)}
        >
          {profile.img && profile.img.length > 0 ? (
            <img
              src={profile.img}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300 shadow"
            />
          ) : (
            <FaUserCircle />
          )}
          <span className="text-base font-semibold text-yellow-800 hidden sm:inline">
            {profile.name ? profile.name : "Profile"}
          </span>
        </button>
        {/* Centered Title - remove Alumni Dashboard text */}
        <div className="flex-1 flex justify-center">
          {/* <span className="text-xl font-bold text-yellow-700">Alumni Dashboard</span> */}
        </div>
        {/* Right side: Posts Feed, Message, Notification, Post button */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full shadow transition flex items-center gap-2"
            onClick={() => window.location.href = '/alumni-posts'}
            aria-label="Posts Feed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
            </svg>
            Posts
          </button>
          <button
            className="text-cyan-500 hover:text-cyan-700 text-3xl relative"
            aria-label="Messages"
            title="View Messages"
            onClick={() => setShowMessages(v => !v)}
          >
            <FaEnvelope />
            {conversations.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
            )}
          </button>
          <button
            className="text-yellow-500 hover:text-yellow-600 text-3xl relative"
            aria-label="Notifications"
            onClick={() => {
              setShowRequests(true);
              markRequestsSeen();
            }}
          >
            <FaBell />
            {hasUnseenRequests && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
            )}
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow transition duration-200 text-base"
            onClick={() => setShowPostModal(true)}
            style={{ minWidth: 100 }}
          >
            + Post
          </button>
        </div>
      </nav>
      {/* Profile Menu Modal */}
      {showProfileMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeInUp border-2 border-yellow-200">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none z-10"
              onClick={() => setShowProfileMenu(false)}
              aria-label="Close Profile Menu"
            >
              ×
            </button>
            <div className="flex flex-col gap-4">
              <button className="w-full px-4 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold text-left" onClick={() => { setShowEditProfile(true); setShowProfileMenu(false); }}>
                Edit Profile
              </button>
              <button
                className="w-full px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold text-left"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/my-posts');
                }}
              >
                My Posts
              </button>
              <button
                className="w-full px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-left"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-cyan-200 backdrop-blur-sm overflow-auto">
          <button
            className="fixed top-6 right-8 text-gray-500 hover:text-red-500 text-4xl font-bold focus:outline-none bg-white/80 rounded-full p-3 shadow-lg transition-all duration-200 border border-yellow-200 z-50"
            style={{ zIndex: 100 }}
            onClick={() => setShowEditProfile(false)}
            aria-label="Close Edit Profile"
            type="button"
          >
            ×
          </button>
          <div className="w-full min-h-screen flex flex-col justify-center items-center py-8">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12 flex flex-col gap-6 relative animate-fadeInUp"
              style={{marginTop: 0, marginBottom: 0, position: 'relative'}}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2 text-center drop-shadow-lg">Edit Profile</h2>
              {/* Name Field */}
              <div className="mt-2">
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Name</label>
                <input
                  id="alumni-name"
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed text-lg shadow-inner focus:outline-indigo-400 transition-all"
                  value={profile.name}
                  disabled
                  style={{ minHeight: 44 }}
                />
              </div>
              {/* Profile Image Upload */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {profile.img && (
                    <img
                      src={profile.img}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-yellow-300 shadow-md"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 transition-all"
                  />
                  {uploading && <span className="text-yellow-600 animate-pulse">Uploading...</span>}
                </div>
              </div>
              {/* Skills */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-inner focus:outline-indigo-400 transition-all text-lg"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-5 py-2 rounded-xl shadow font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-60 text-lg"
                    onClick={addSkill}
                    disabled={!skillInput.trim() || uploading}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-yellow-200/80 text-yellow-900 px-4 py-1 rounded-full flex items-center gap-1 shadow-sm border border-yellow-300 hover:bg-yellow-300/90 transition-all text-base"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-1 text-red-500 hover:text-red-700 font-bold text-lg"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove skill ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {/* Company */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Current Company</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-inner focus:outline-indigo-400 transition-all text-lg"
                  value={profile.company}
                  onChange={e => setProfile({ ...profile, company: e.target.value })}
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-inner focus:outline-indigo-400 transition-all text-lg resize-none"
                  value={profile.description}
                  onChange={e => setProfile({ ...profile, description: e.target.value })}
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg text-lg tracking-wide mt-2 sticky bottom-0"
                style={{zIndex: 10}}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeInUp border-2 border-yellow-200">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none z-10"
              onClick={() => setShowPostModal(false)}
              aria-label="Close Post Modal"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Create Post</h2>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-4 py-3 shadow-inner focus:outline-indigo-400 transition-all text-lg resize-none mb-4"
              value={postDescription}
              onChange={e => setPostDescription(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePostImageChange}
              className="mb-4"
            />
            {postImagePreview && (
              <img src={postImagePreview} alt="Preview" className="w-full rounded-xl mb-4" />
            )}
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg text-lg tracking-wide"
              onClick={handleSendPost}
              disabled={posting}
            >
              {posting ? 'Posting...' : 'Send Post'}
            </button>
          </div>
        </div>
      )}
      {/* Connection Requests Modal */}
      {showRequests && (
        <Modal onClose={() => setShowRequests(false)} title="Pending Connection Requests">
          {pendingRequests.length === 0 ? (
            <div className="text-center text-gray-500">No pending requests.</div>
          ) : (
            <ul className="divide-y">
              {pendingRequests.map((req, idx) => (
                <li key={req._id || idx} className="py-2 flex items-center gap-3">
                  <img src={req.studentImg || '/default-avatar.png'} alt="student" className="w-8 h-8 rounded-full" />
                  <span className="font-semibold text-yellow-700">{req.studentName}</span>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full ml-2" onClick={() => handleRespond(req._id, "accept")}>Accept</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full ml-2" onClick={() => handleRespond(req._id, "reject")}>Reject</button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
      {/* Messages Dropdown Modal */}
      {showMessages && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/20" onClick={() => setShowMessages(false)}>
          <div className="bg-white rounded-2xl shadow-2xl mt-20 mr-8 p-4 w-96 max-h-[70vh] overflow-y-auto border-2 border-cyan-200 animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-cyan-700">Messages from Students</h3>
              <button className="text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setShowMessages(false)} aria-label="Close Messages">×</button>
            </div>
            {loadingConversations ? (
              <div className="text-cyan-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-gray-400">No conversations yet.</div>
            ) : (
              <ul className="divide-y">
                {conversations.map(conv => {
                  const name = conv.studentName && conv.studentName !== 'Student' ? conv.studentName : 'Unknown';
                  const img = conv.studentImg && conv.studentImg !== '/default-avatar.png' ? conv.studentImg : '';
                  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
                  return (
                    <li key={conv.studentId} className="py-3 flex items-center gap-3">
                      {img ? (
                        <img
                          src={img}
                          alt={name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-cyan-300"
                          onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-cyan-300 bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-lg">
                          {initials}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-cyan-800">{name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[180px]">{conv.lastMessage?.content || 'No messages yet.'}</div>
                      </div>
                      <button
                        className="ml-auto bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition"
                        onClick={() => navigate(`/chat/${conv.studentId}`)}
                      >
                        Open
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Main Content Placeholder */}
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Remove welcome text */}
        {/* <p className="text-lg">Welcome, {profile.name ? profile.name : "Alumni"}!</p> */}
        {/* Posts Feed */}
        <div className="w-full max-w-2xl mt-8 flex flex-col gap-8">
          {posts.map((post, idx) => (
            <div key={post._id || idx} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-indigo-700">
                  {post.authorModel === 'Alumni'
                    ? `Alumni: ${
                        post.author && post.author.name && post.author.name !== 'Unknown'
                          ? post.author.name
                          : post.authorName && post.authorName !== 'Unknown'
                            ? post.authorName
                            : profile.name && profile.name !== 'Unknown'
                              ? profile.name
                              : 'Alumni'
                      }`
                    : post.authorModel === 'TPO'
                      ? `TPO: ${post.author && post.author.name ? post.author.name : 'TPO'}`
                      : 'Unknown'}
                </span>
                <span className="text-gray-400 text-xs">{post.createdAt ? post.createdAt.slice(0, 10) : ''}</span>
                {isMyPost(post) && (
                  <button
                    className="ml-auto text-red-500 hover:text-red-700 text-xl p-1 rounded-full"
                    title="Delete Post"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <div className="mb-2 text-gray-800">{post.content}</div>
              {post.image && (
                <img src={post.image} alt="Post" className="w-full rounded-xl mb-2" />
              )}
              <div className="flex gap-4 mt-2">
                {(() => {
                  const userId = alumni?.email || alumni?._id || alumni?.id;
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
        </div>
      </main>
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
             ) }
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDashboard;