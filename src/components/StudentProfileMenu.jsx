import React, { useRef, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const StudentProfileMenu = ({ open, onClose, student, onPhotoUploaded, onEmailUpdated }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [form, setForm] = useState({
    name: student?.name || '',
    email: student?.email || '',
    role: student?.role || 'student',
    passout: student?.passout || '',
  });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;
  // Get first letter of student name for avatar
  const firstLetter = student?.name ? student.name.trim().charAt(0).toUpperCase() : "S";
  const hasPhoto = student?.img && student.img.length > 0;

  // Handle file upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    toast.info('Uploading image...', { autoClose: false, toastId: 'uploading' });
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/student/me/photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (onPhotoUploaded) onPhotoUploaded(data.url);
        toast.update('uploading', { render: 'Upload successful!', type: 'success', autoClose: 2000 });
      } else {
        setError(data.error || "Upload failed");
        toast.update('uploading', { render: data.error || 'Upload failed!', type: 'error', autoClose: 2000 });
      }
    } catch (err) {
      setError("Upload failed");
      toast.update('uploading', { render: 'Upload failed!', type: 'error', autoClose: 2000 });
    } finally {
      setUploading(false);
    }
  };

  // Handle edit profile form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Validation for alumni
      if (form.role === 'alumni') {
        if (!form.passout) {
          toast.error('Passout year required to become alumni.');
          setSaving(false);
          return;
        }
        const currentYear = new Date().getFullYear();
        if (parseInt(form.passout) > currentYear) {
          toast.error('Passout year cannot be in the future.');
          setSaving(false);
          return;
        }
      }
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/student/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Profile updated!');
        if (onPhotoUploaded) onPhotoUploaded(data.student.img);
        if (onEmailUpdated && data.student.email) onEmailUpdated(data.student.email);
        setEditMode(false);
        // Redirect to alumni dashboard if role changed to alumni
        if (form.role === 'alumni') {
          setTimeout(() => {
            window.location.href = '/dashboard/alumni';
          }, 1200);
        }
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  // Handle save password
  const handleSavePassword = async () => {
    setPasswordSaving(true);
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required.');
      setPasswordSaving(false);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
      setPasswordSaving(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/student/me/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password changed successfully!');
        setChangePasswordMode(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.error || 'Password change failed');
      }
    } catch (err) {
      toast.error('Password change failed');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-fadeInUp">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close profile menu"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-2 mb-4">
          {/* Avatar with photo or first letter */}
          <div className="relative group">
            {hasPhoto ? (
              <img src={student.img} alt="Profile" className="w-20 h-20 rounded-full border-4 border-cyan-200 object-cover shadow" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-400 flex items-center justify-center border-4 border-cyan-200 shadow text-white text-4xl font-extrabold select-none">
                {firstLetter}
              </div>
            )}
            <button
              className="absolute bottom-0 right-0 bg-white border border-cyan-300 rounded-full p-2 shadow hover:bg-cyan-100 transition-colors flex items-center justify-center"
              onClick={() => fileInputRef.current.click()}
              title="Change photo"
              disabled={uploading}
              style={{ width: '2.5rem', height: '2.5rem' }}
            >
              {/* Plus icon for uploading */}
              <svg className="w-5 h-5 text-cyan-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoChange}
              disabled={uploading}
            />
            {uploading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full"><span className="text-cyan-700 font-bold">Uploading...</span></div>}
          </div>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          <div className="font-bold text-xl text-indigo-700">{student?.name || 'Student Name'}</div>
          <div className="text-cyan-700 text-sm font-semibold">{student?.email || 'student@email.com'}</div>
          <div className="text-gray-500 text-xs">PRN: {student?.prn || '1234567890'}</div>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          {editMode ? (
            <>
              {/* Only show email, not name, and clear field for editing */}
              <input
                className="w-full py-2 px-3 rounded-xl border border-cyan-200 mb-2"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="Enter new email"
                autoComplete="off"
              />
              <select
                className="w-full py-2 px-3 rounded-xl border border-cyan-200 mb-2"
                name="role"
                value={form.role}
                onChange={handleFormChange}
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
              {form.role === 'alumni' && (
                <input
                  className="w-full py-2 px-3 rounded-xl border border-cyan-200 mb-2"
                  name="passout"
                  value={form.passout}
                  onChange={handleFormChange}
                  placeholder="Passout Year"
                  type="number"
                />
              )}
              <button
                className="w-full py-2 rounded-xl bg-cyan-600 text-white font-semibold transition"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="w-full py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold transition mt-1"
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          ) : changePasswordMode ? (
            <>
              <input
                className="w-full py-2 px-3 rounded-xl border border-cyan-200 mb-2"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Old Password"
                type="password"
              />
              <input
                className="w-full py-2 px-3 rounded-xl border border-cyan-200 mb-2"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                type="password"
              />
              <input
                className="w-full py-2 px-3 rounded-xl border border-cyan-200 mb-2"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                type="password"
              />
              <button
                className="w-full py-2 rounded-xl bg-yellow-600 text-white font-semibold transition"
                onClick={handleSavePassword}
                disabled={passwordSaving}
              >
                {passwordSaving ? 'Saving...' : 'Save Password'}
              </button>
              <button
                className="w-full py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold transition mt-1"
                onClick={() => setChangePasswordMode(false)}
                disabled={passwordSaving}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="w-full py-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-semibold transition" onClick={() => setEditMode(true)}>Edit Email</button>
              <button className="w-full py-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold transition" onClick={() => setChangePasswordMode(true)}>Change Password</button>
              <button className="w-full py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold transition" onClick={() => { onClose && onClose(); navigate('/dashboard/student/connections'); }}>My Connections</button>
              <button className="w-full py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
      <style>{`
        .animate-fadeInUp { animation: fadeInUp 0.4s cubic-bezier(.23,1.02,.58,.99) both; }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StudentProfileMenu;
