import React, { useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import AlumniCard from "./AlumniCard";
import StudentProfileMenu from "./StudentProfileMenu";
import { FaUserCircle, FaRegCommentDots } from "react-icons/fa";

const alumniList = [
	{
		name: "Amit Sharma",
		img: "https://randomuser.me/api/portraits/men/32.jpg",
		skills: ["React", "Node.js", "AWS"],
		company: "Google",
		description:
			"Software Engineer at Google, passionate about cloud and web tech.",
	},
	{
		name: "Priya Singh",
		img: "https://randomuser.me/api/portraits/women/44.jpg",
		skills: ["UI/UX", "Figma", "Design"],
		company: "Microsoft",
		description:
			"Product Designer at Microsoft, loves building beautiful interfaces.",
	},
	{
		name: "Rahul Mehta",
		img: "https://randomuser.me/api/portraits/men/65.jpg",
		skills: ["Python", "ML", "Data Science"],
		company: "Amazon",
		description: "Data Scientist at Amazon, working on AI and analytics.",
	},
];

const skills = [
	"React",
	"Node.js",
	"AWS",
	"UI/UX",
	"Figma",
	"Design",
	"Python",
	"ML",
	"Data Science",
];
const companies = ["Google", "Microsoft", "Amazon", "TCS", "Infosys","Wipro","Accenture","Cognizant","HCL","IBM"];

const StudentDashboard = () => {
	const [showMessages, setShowMessages] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [selectedCompanies, setSelectedCompanies] = useState([]);
	const [showProfile, setShowProfile] = useState(false);
	const [student, setStudent] = useState(() => {
		// Try to get user from localStorage as fallback
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}); // Store fetched student data

	// Fetch student data on mount
	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await fetch("/api/student/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (res.ok) {
					const data = await res.json();
					// If API returns a different user, update localStorage and state
					const localUser = localStorage.getItem('user');
					if (!localUser || (localUser && JSON.parse(localUser).email !== data.email)) {
						localStorage.setItem('user', JSON.stringify(data));
					}
					setStudent(data);
					console.log("Fetched student data:", data);
				}
			} catch (err) {
				console.error("Failed to fetch student data", err);
			}
		};
		fetchStudent();
	}, []);

	// Filter alumni based on search and filters
	const filteredAlumni = alumniList.filter((a) => {
		const matchesSearch =
			a.name.toLowerCase().includes(search.toLowerCase()) ||
			a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
			a.company.toLowerCase().includes(search.toLowerCase());
		const matchesSkills =
			selectedSkills.length === 0 ||
			selectedSkills.every((s) => a.skills.includes(s));
		const matchesCompanies =
			selectedCompanies.length === 0 ||
			selectedCompanies.includes(a.company);
		return matchesSearch && matchesSkills && matchesCompanies;
	});

	const toggleSkill = (skill) => {
		setSelectedSkills((skills) =>
			skills.includes(skill)
				? skills.filter((s) => s !== skill)
				: [...skills, skill]
		);
	};
	const toggleCompany = (company) => {
		setSelectedCompanies((cs) =>
			cs.includes(company)
				? cs.filter((c) => c !== company)
				: [...cs, company]
		);
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
				{/* Spacer for space-around effect */}
				<div className="flex-1"></div>
				{/* Message Icon (right) */}
				<button
					className="text-cyan-700 hover:text-cyan-900 text-4xl flex-1 flex justify-end relative"
					aria-label="Messages"
					onClick={() => setShowMessages(true)}
				>
					<FaRegCommentDots />
					<span className="absolute -top-1 -right-2 w-3 h-3 bg-pink-500 rounded-full border-2 border-white animate-pulse"></span>
				</button>
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
			/>
			{/* Main Content */}
			<div className="flex flex-1 w-full max-w-7xl mx-auto mt-6 gap-8 px-2 md:px-6">
				{/* Filters */}
				<aside className="hidden md:flex flex-col w-64 bg-white/80 rounded-2xl shadow-xl p-6 h-[calc(100vh-7rem)] sticky top-24 self-start border border-cyan-100 overflow-y-auto custom-scrollbar">
					<h3 className="font-extrabold text-xl text-cyan-700 mb-4 flex items-center gap-2">
						<span className="inline-block w-2 h-6 bg-cyan-400 rounded-full"></span>
						Filter by Skills
					</h3>
					<div className="flex flex-wrap gap-2 mb-8">
						{skills.map((skill) => (
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
						{companies.map((company) => (
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
							filteredAlumni.map((alumni, i) => (
								<AlumniCard key={i} alumni={alumni} />
							))
						)}
					</div>
				</main>
			</div>
			{/* Message Box Modal */}
			<MessageBox open={showMessages} onClose={() => setShowMessages(false)} />
		</div>
	);
};

export default StudentDashboard;
