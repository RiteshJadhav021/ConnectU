import React, { useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import AlumniCard from "./AlumniCard";
import StudentProfileMenu from "./StudentProfileMenu";
import QnASection from './QnASection';
import AlumniPostFeed from "./AlumniPostFeed";
import { FaUserCircle, FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // (Assume a simple Modal component exists or will be created)
import { API_BASE_URL } from "../config";

// Companies will be derived dynamically from alumni data
const defaultCompanies = [];

const StudentDashboard = () => {
	const [showMessages, setShowMessages] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [selectedCompanies, setSelectedCompanies] = useState([]);
	const [companies, setCompanies] = useState(defaultCompanies);
	const [showProfile, setShowProfile] = useState(false);
	const [student, setStudent] = useState(() => {
		// Try to get user from localStorage as fallback
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}); // Store fetched student data
	const [alumniList, setAlumniList] = useState([]);
	const [allSkills, setAllSkills] = useState([]);
	const [stages, setStages] = useState({}); // Track stage for each alumni

	const [myConnections, setMyConnections] = useState([]);
	const [showConnections, setShowConnections] = useState(false);
	const [visibleCount, setVisibleCount] = useState(6); // Show 6 alumni initially (2 rows x 3 cols)
	const navigate = useNavigate();

	// Only render after student data is loaded
	// if (!student || !student._id) {
	// 	return <div className="flex items-center justify-center min-h-screen text-xl text-cyan-700 font-bold">Loading student data...</div>;
	// }

	// Fetch student data on mount
	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${API_BASE_URL}/student/me`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (res.ok) {
					const data = await res.json();
					setStudent(data);
					// Always update localStorage with full student object (including _id)
					localStorage.setItem('user', JSON.stringify(data));
				} else {
					const errText = await res.text();
					console.error("Student fetch failed:", errText);
				}
			} catch (err) {
				console.error("Failed to fetch student data", err);
			}
		};
		fetchStudent();
	}, []);

	// Fetch alumni list from backend
	useEffect(() => {
		fetch(`${API_BASE_URL}/alumni`)
			.then(res => res.json())
			.then(data => {
				setAlumniList(data);
				// Collect all unique skills from alumni
				const skillsSet = new Set();
				const companySet = new Set();
				data.forEach(alumni => {
					if (Array.isArray(alumni.skills)) {
						alumni.skills.forEach(skill => skillsSet.add(skill));
					}
					if (alumni.company && typeof alumni.company === 'string') {
						const companyName = alumni.company.trim();
						if (companyName.length > 0) companySet.add(companyName);
					}
				});
				setAllSkills(Array.from(skillsSet));
				setCompanies(Array.from(companySet));
			})
			.catch(() => setAlumniList([]));
	}, []);

	// Sync stages with backend connection requests (with polling)
	useEffect(() => {
		if (!student?._id) return;
		
		const fetchConnectionStatuses = () => {
			fetch(`${API_BASE_URL}/connections/requested/${student._id}`)
				.then(res => res.json())
				.then(data => {
					// data should be an array of { alumniId, status }
					const newStages = {};
					(data || []).forEach(req => {
						newStages[req.alumniId] = req.status; // status: 'pending', 'accepted', 'rejected'
					});
					setStages(newStages);
				})
				.catch(() => {});
		};
		
		fetchConnectionStatuses(); // Initial fetch
		const interval = setInterval(fetchConnectionStatuses, 5000); // Poll every 5 seconds
		return () => clearInterval(interval);
	}, [student?._id]);



	// Fetch my accepted connections
	const fetchMyConnections = () => {
		if (!student?._id) return;
		fetch(`${API_BASE_URL}/connections/my/${student._id}`)
			.then(res => res.json())
			.then(data => setMyConnections(data || []))
			.catch(() => setMyConnections([]));
	};



	// Filter alumni based on search and filters
	const filteredAlumni = alumniList.filter((a) => {
		const matchesSearch =
			a.name.toLowerCase().includes(search.toLowerCase()) ||
			(a.skills && a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))) ||
			(a.company && a.company.toLowerCase().includes(search.toLowerCase()));
		const matchesSkills =
			selectedSkills.length === 0 ||
			selectedSkills.every((s) => a.skills && a.skills.includes(s));
		const matchesCompanies =
			selectedCompanies.length === 0 ||
			(a.company && selectedCompanies.includes(a.company));
		return matchesSearch && matchesSkills && matchesCompanies;
	});

	const toggleSkill = (skill) => {
		setSelectedSkills((skills) =>
			skills.includes(skill)
				? skills.filter((s) => s !== skill)
				: [...skills, skill]
		);
		setVisibleCount(6); // Reset to show first 6 when filter changes
	};
	const toggleCompany = (company) => {
		setSelectedCompanies((cs) =>
			cs.includes(company)
				? cs.filter((c) => c !== company)
				: [...cs, company]
		);
		setVisibleCount(6); // Reset to show first 6 when filter changes
	};
	
	// Reset pagination when search changes
	useEffect(() => {
		setVisibleCount(6);
	}, [search]);

	// Send connection request to backend and update stage
	// This function ensures the UI shows 'Pending' immediately after clicking Connect
	const handleStageChange = async (alumniId) => {
  if (!student?._id) return;
  // Optimistically set the stage to 'pending' for instant feedback
  setStages((prev) => ({ ...prev, [alumniId]: 'pending' }));
  try {
    const res = await fetch(`${API_BASE_URL}/connections/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromStudent: student._id, toAlumni: alumniId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStages((prev) => {
        const newStages = { ...prev };
        delete newStages[alumniId];
        return newStages;
      });
      alert(data.error || 'Failed to send connection request.');
    }
  } catch (err) {
    setStages((prev) => {
      const newStages = { ...prev };
      delete newStages[alumniId];
      return newStages;
    });
    alert('Failed to send connection request.');
  }
};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 flex flex-col">
			{/* Custom Dashboard Navbar */}
			<nav className="w-full flex items-center justify-between px-4 py-3 shadow-lg bg-white/80 backdrop-blur-lg sticky top-0 z-30">
				{/* Profile Icon (left) */}
				<button
					className="text-cyan-700 hover:text-cyan-900 text-4xl flex-1 flex items-center gap-2 justify-start"
					aria-label="Profile"
					onClick={() => setShowProfile(true)}
				>
					{/* Avatar with photo or first letter */}
					{student?.img && student.img.length > 0 ? (
						<img
							src={student.img}
							alt="Profile"
							className="w-10 h-10 rounded-full object-cover border-2 border-cyan-300 shadow"
						/>
					) : (
						<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-400 flex items-center justify-center shadow text-white text-xl font-extrabold select-none">
							{student?.name ? student.name.trim().charAt(0).toUpperCase() : "S"}
						</div>
					)}
					<span className="text-base font-semibold text-cyan-800 hidden sm:inline">
						{student ? student.name : "Profile"}
					</span>
				</button>
				{/* Right side: Posts Feed, Message icons */}
				<div className="flex-1 flex justify-end items-center gap-4">
					<button
						className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
						onClick={() => navigate('/alumni-posts')}
						aria-label="Posts Feed"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
						</svg>
						Posts Feed
					</button>
					<button
						className="text-cyan-700 hover:text-cyan-900 text-4xl relative transition-colors duration-200"
						aria-label="Messages"
						onClick={() => setShowMessages(true)}
					>
						<FaRegCommentDots />
						<span className="absolute -top-1 -right-2 w-3 h-3 bg-pink-500 rounded-full border-2 border-white animate-pulse"></span>
					</button>
				</div>
			</nav>
			{/* Student Profile Menu Modal */}
			<StudentProfileMenu
				open={showProfile}
				onClose={() => setShowProfile(false)}
				student={student || {}}
				onPhotoUploaded={(url) => {
					// Update student state and localStorage with new photo URL
					setStudent((prev) => ({ ...prev, img: url }));
					const user = localStorage.getItem('user');
					if (user) {
						const userObj = JSON.parse(user);
						userObj.img = url;
						localStorage.setItem('user', JSON.stringify(userObj));
					}
				}}
				onEmailUpdated={(newEmail) => {
					setStudent((prev) => ({ ...prev, email: newEmail }));
					const user = localStorage.getItem('user');
					if (user) {
						const userObj = JSON.parse(user);
						userObj.email = newEmail;
						localStorage.setItem('user', JSON.stringify(userObj));
					}
				}}
				myConnections={myConnections}
				onShowConnections={() => {
					fetchMyConnections();
					setShowConnections(true);
				}}
			/>
			{/* My Connections Modal */}
			{showConnections && (
				<Modal onClose={() => setShowConnections(false)} title="My Connections">
					{myConnections.length === 0 ? (
						<div className="text-center text-gray-500">No connections yet.</div>
					) : (
						<ul className="divide-y">
							{myConnections.map((conn, idx) => (
								<li key={conn._id || idx} className="py-2 flex items-center gap-3">
									<img src={conn.alumniImg || '/default-avatar.png'} alt="alumni" className="w-8 h-8 rounded-full" />
									<span className="font-semibold text-cyan-700">{conn.alumniName}</span>
									<span className="text-gray-500">{conn.company}</span>
								</li>
							))}
						</ul>
					)}
				</Modal>
			)}
			{/* Main Content */}
			<div className="flex flex-1 w-full max-w-7xl mx-auto mt-6 gap-8 px-2 md:px-6">
				{/* Filters */}
				<aside className="hidden md:flex flex-col w-64 bg-white/80 rounded-2xl shadow-xl p-6 h-[650px] sticky top-24 self-start border border-cyan-100 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 7rem)', minHeight: '300px' }}>
					<h3 className="font-extrabold text-xl text-cyan-700 mb-4 flex items-center gap-2">
						<span className="inline-block w-2 h-6 bg-cyan-400 rounded-full"></span>
						Filter by Skills
					</h3>
					<div className="flex flex-wrap gap-2 mb-8">
						{allSkills.map((skill) => (
							<button
								key={skill}
								onClick={() => toggleSkill(skill)}
								className={`px-4 py-2 rounded-full border text-sm font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400
          ${
			selectedSkills.includes(skill)
				? "bg-cyan-600 text-white border-cyan-700 scale-105"
				: "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200 hover:scale-105"
		}
        `}
							>
								{skill}
							</button>
						))}
					</div>
					<h3 className="font-extrabold text-xl text-indigo-700 mb-4 flex items-center gap-2">
						<span className="inline-block w-2 h-6 bg-indigo-400 rounded-full"></span>
						Filter by Company
					</h3>
					<div className="flex flex-wrap gap-2">
						{companies.length === 0 ? (
							<div className="text-sm text-gray-500">No companies found from alumni data.</div>
						) : companies.map((company) => (
							<button
								key={company}
								onClick={() => toggleCompany(company)}
								className={`px-4 py-2 rounded-full border text-sm font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400
          ${
			selectedCompanies.includes(company)
				? "bg-indigo-600 text-white border-indigo-700 scale-105"
				: "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 hover:scale-105"
		}
        `}
							>
								{company}
							</button>
							))}
					</div>
				</aside>
				{/* Center Content */}
				<main className="flex-1 flex flex-col items-center">
					{/* Search Bar */}
					<div className="w-full max-w-2xl mb-8">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search alumni by name, skills, company..."
							className="w-full px-6 py-3 rounded-full border border-cyan-200 bg-white/80 text-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-400"
						/>
					</div>
					{/* Alumni List */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
						{filteredAlumni.length === 0 ? (
							<div className="col-span-full text-center text-cyan-700 font-semibold text-xl">
								No alumni found.
							</div>
						) : (
							filteredAlumni.slice(0, visibleCount).map((alumni) => {
								if (!alumni._id) return null; // skip if no id
								return (
									<AlumniCard
										key={alumni._id}
										alumni={alumni}
										studentId={student?._id || ""}
										connectionStatus={stages[alumni._id] || ""}
										onRequestSent={(alumniId) => handleStageChange(alumniId)}
									/>
								);
							})
						)}
					</div>
					{/* More Button */}
					{filteredAlumni.length > visibleCount && (
						<div className="w-full flex justify-center mt-8">
							<button
								className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
								onClick={() => setVisibleCount(prev => prev + 6)}
							>
								More Alumni ({filteredAlumni.length - visibleCount} remaining)
							</button>
						</div>
					)}
				</main>
			</div>
			{/* Message Box Modal */}
			<MessageBox open={showMessages} onClose={() => setShowMessages(false)} />
			{/* Q&A Section Modal */}
			{showMessages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-indigo-100 via-white to-blue-100 rounded-2xl shadow-2xl p-0 max-w-3xl w-full relative animate-fadeInUp border-2 border-indigo-200">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none z-10"
              onClick={() => setShowMessages(false)}
              aria-label="Close Q&A"
            >
              ×
            </button>
            <div className="flex flex-col md:flex-row h-[70vh]">
              <div className="flex-1 flex flex-col justify-start p-8 bg-white rounded-l-2xl overflow-y-auto max-h-[60vh] custom-scrollbar">
                <QnASection />
              </div>
              <div className="hidden md:flex flex-col items-center justify-center w-64 bg-gradient-to-b from-indigo-200 to-blue-200 rounded-r-2xl p-6">
                <svg className="w-20 h-20 text-indigo-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                  <path d="M24 4a20 20 0 100 40 20 20 0 000-40zm0 36a16 16 0 110-32 16 16 0 010 32zm-2-10v-4a2 2 0 014 0v4a2 2 0 01-4 0zm0-8a2 2 0 114 0 2 2 0 01-4 0z" />
                </svg>
                <div className="text-lg text-indigo-700 font-semibold text-center">Ask questions, get answers from alumni, teachers, and TPO!</div>
              </div>
            </div>
          </div>
        </div>
      )}
		</div>
	);
};

export default StudentDashboard;
