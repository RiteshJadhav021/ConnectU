import React, { useRef } from "react";
import { gsap } from "gsap";

const alumniList = [
	{
		name: "Rick Huang",
		rating: 5.0,
		title: "Senior Software Engineer at Netflix",
		verified: true,
		tags: ["Software Engineering", "Career Development", "Backend"],
		image: "https://randomuser.me/api/portraits/men/32.jpg",
	},
	{
		name: "Akram Riahi",
		rating: 5.0,
		title: "Lead SRE/Chaos Engineer/Speaker",
		verified: false,
		tags: ["SRE", "Cloud Infrastructure", "DevOps"],
		image: "https://randomuser.me/api/portraits/men/33.jpg",
	},
	{
		name: "Daniel Kong",
		rating: 5.0,
		title: "Senior Software Engineer at Uber",
		verified: true,
		tags: ["Mobile Development", "iOS", "Swift"],
		image: "https://randomuser.me/api/portraits/men/34.jpg",
	},
];

const AlumniShowcase = () => {
	const capRef = useRef(null);
	// Repeat alumni list for smooth vertical scroll
	const repeatedAlumni = [...alumniList, ...alumniList];

	// 3D cap mouse move handler using GSAP
	const handleMouseMove = (e) => {
		const cap = capRef.current;
		if (!cap) return;
		const rect = cap.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const rotateX = ((y - centerY) / centerY) * 18; // max 18deg
		const rotateY = ((x - centerX) / centerX) * -18;
		gsap.to(cap, {
			rotateX,
			rotateY,
			duration: 0.3,
			transformPerspective: 800,
			transformOrigin: "center",
		});
	};
	const handleMouseLeave = () => {
		const cap = capRef.current;
		gsap.to(cap, {
			rotateX: 0,
			rotateY: 0,
			duration: 0.5,
			transformPerspective: 800,
			transformOrigin: "center",
		});
	};

	return (
		<div className="w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-200 rounded-2xl shadow-2xl p-8 my-12 min-h-[340px] max-w-6xl mx-auto border border-gray-100">
			{/* Left Side: ConnectU Logo SVG, improved design */}
			<div className="flex-1 flex items-center justify-center min-w-[320px] h-[320px] md:h-[420px]">
				<div className="flex flex-col items-center justify-center rounded-3xl border-4 border-[#22223b] bg-white shadow-2xl p-6" style={{boxShadow: '0 6px 32px 0 rgba(34,34,59,0.12), 0 0 0 8px rgba(34,34,59,0.10)'}}>
					<svg
						width="240"
						height="140"
						viewBox="0 0 340 180"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						style={{ filter: 'drop-shadow(0 8px 24px rgba(34,34,59,0.18))' }}
					>
						<text
							x="60"
							y="44"
							fontFamily="serif"
							fontWeight="bold"
							fontSize="42"
							fill="#8B5C2A"
							letterSpacing="2"
						>
							Connect
						</text>
						<text
							x="235"
							y="44"
							fontFamily="serif"
							fontWeight="bold"
							fontSize="42"
							fill="#22223b"
							letterSpacing="2"
						>
							U
						</text>
						<text
							x="270"
							y="48"
							fontFamily="serif"
							fontWeight="bold"
							fontSize="18"
							fill="#222"
						>
							™
						</text>
						<rect
							x="80"
							y="60"
							width="180"
							height="80"
							rx="22"
							fill="#fff"
							stroke="#22223b"
							strokeWidth="7"
						/>
						<text
							x="110"
							y="120"
							fontFamily="Arial Black,Arial,sans-serif"
							fontWeight="bold"
							fontSize="68"
							fill="#22223b"
							letterSpacing="6"
						>
							CU
						</text>
					</svg>
					<span className="mt-4 text-xl text-gray-700 font-serif font-semibold tracking-wide shadow-sm bg-white/80 px-4 py-2 rounded-lg border border-gray-200">
						See you at your destiny
					</span>
				</div>
			</div>
			{/* Right Side: Alumni List (unchanged, but improved card design) */}
			<div className="flex-1 flex flex-col items-end h-[320px] overflow-hidden relative mt-8 md:mt-0">
				<div
					className="flex flex-col gap-7 animate-alumni-marquee"
					style={{ animation: "alumni-marquee 12s linear infinite" }}
				>
					{[...alumniList, ...alumniList].map((alum, idx) => (
						<div
							key={idx}
							className="flex items-center bg-white/90 border border-gray-200 rounded-2xl shadow-lg p-5 min-w-[360px] max-w-[420px] gap-5 hover:shadow-2xl transition-shadow duration-200"
						>
							<img
								src={alum.image}
								alt={alum.name}
								className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm"
							/>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<span className="font-semibold text-gray-900 text-lg tracking-wide">
										{alum.name}
									</span>
									<span className="text-green-500 font-bold text-base flex items-center">
										★ {alum.rating}
									</span>
									{alum.verified && (
										<span
											className="text-blue-500 text-lg"
											title="Verified"
										>
											✔️
										</span>
									)}
								</div>
								<div className="text-gray-600 text-base mb-2 font-medium">
									{alum.title}
								</div>
								<div className="flex flex-wrap gap-2 mt-1">
									{alum.tags.map((tag, i) => (
										<span
											key={i}
											className="bg-gray-100 text-gray-700 text-xs font-semibold rounded-full px-4 py-1 border border-gray-200 shadow-sm"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
				<style>{`
				  @keyframes alumni-marquee {
					0% { transform: translateY(0); }
					100% { transform: translateY(-50%); }
				  }
				`}</style>
			</div>
		</div>
	);
};

export default AlumniShowcase;
