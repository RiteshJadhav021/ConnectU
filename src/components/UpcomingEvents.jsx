import React from "react";

const events = [
	{
		title: "Alumni Meet 2025",
		date: "July 20, 2025",
		desc: "Annual alumni gathering and networking event.",
		location: "College Auditorium",
	},
	{
		title: "Career Guidance Webinar",
		date: "August 5, 2025",
		desc: "Webinar on career planning and job search tips.",
		location: "Online (Zoom)",
	},
	{
		title: "Tech Talk: AI in Industry",
		date: "September 10, 2025",
		desc: "Industry experts discuss the latest in AI & ML.",
		location: "Seminar Hall B",
	},
];

const icon = (
	<svg
		className="w-8 h-8 text-indigo-500"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.2"
		viewBox="0 0 24 24"
	>
		<rect x="3" y="4" width="18" height="18" rx="4" />
		<path d="M16 2v4M8 2v4M3 10h18" />
	</svg>
);

const UpcomingEvents = () => (
	<section className="py-16 bg-gradient-to-br from-cyan-50 to-white">
		<h2 className="text-3xl sm:text-4xl font-bold text-center text-indigo-700 mb-12 drop-shadow-lg tracking-tight">
			Upcoming Events
		</h2>
		<div className="flex flex-wrap justify-center gap-8">
			{events.map((e, i) => (
				<div
					key={i}
					className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-xs w-full border border-cyan-100 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-indigo-200 duration-300"
				>
					<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full p-3 shadow-lg">
						{icon}
					</div>
					<div className="mt-6 mb-2 text-center">
						<div className="font-extrabold text-xl text-indigo-700 mb-1 leading-tight">
							{e.title}
						</div>
						<div className="text-cyan-700 font-semibold mb-1 flex items-center justify-center gap-2">
							<svg
								className="w-5 h-5 text-cyan-400"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{e.date}
						</div>
						<div className="text-gray-600 mb-3 text-sm min-h-[48px]">
							{e.desc}
						</div>
						<div className="text-xs text-cyan-600 font-medium flex items-center justify-center gap-1">
							<svg
								className="w-4 h-4 text-cyan-400"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							{e.location}
						</div>
					</div>
				</div>
			))}
		</div>
	</section>
);

export default UpcomingEvents;
