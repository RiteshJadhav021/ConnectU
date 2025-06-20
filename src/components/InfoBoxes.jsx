import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const infoData = [
	{
		title: 'Direct Alumni Access',
		desc: 'Connect with experienced alumni for real-world advice, mentorship, and networking opportunities tailored to your career goals.',
		icon: (
			<svg
				className="w-10 h-10 text-cyan-500"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.2"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 8v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a6 6 0 0112 0z"
				/>
			</svg>
		),
	},
	{
		title: 'Career & Internship Tips',
		desc: 'Get exclusive insights on jobs, internships, and industry trends directly from those who have been there before you.',
		icon: (
			<svg
				className="w-10 h-10 text-yellow-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.2"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H7m5 0h5"
				/>
			</svg>
		),
	},
	{
		title: 'Ask & Get Answers',
		desc: 'Post your questions and receive personalized answers from alumni who want to help you succeed.',
		icon: (
			<svg
				className="w-10 h-10 text-pink-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.2"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.5C3.67 15.1 3 13.62 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				/>
			</svg>
		),
	},
	{
		title: 'Build Your Network',
		desc: 'Expand your professional network and open doors to new opportunities through meaningful alumni connections.',
		icon: (
			<svg
				className="w-10 h-10 text-green-400"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.2"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 8v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a6 6 0 0112 0z"
				/>
			</svg>
		),
	},
];

const InfoBoxes = () => {
	const boxRefs = useRef([]);
	const sectionRef = useRef(null);

	useEffect(() => {
		if (boxRefs.current && sectionRef.current) {
			boxRefs.current.forEach((el, idx) => {
				gsap.fromTo(
					el,
					{ y: 80, opacity: 0, scale: 0.85, rotate: idx % 2 === 0 ? -6 : 6 },
					{
						y: 0,
						opacity: 1,
						scale: 1,
						rotate: 0,
						duration: 1.2,
						delay: idx * 0.15,
						ease: 'power4.out',
						scrollTrigger: {
							trigger: el,
							start: 'top 85%',
							toggleActions: 'play none none reset',
						},
					}
				);
			});
		}
	}, []);

	return (
		<section
			ref={sectionRef}
			className="w-full py-12 bg-white flex flex-col items-center"
		>
			<div className="max-w-6xl w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{infoData.map((box, idx) => (
					<div
						key={idx}
						ref={(el) => (boxRefs.current[idx] = el)}
						className="flex flex-col items-center text-center bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl shadow-xl p-8 border-t-4 border-b-4 border-cyan-200 hover:scale-105 hover:shadow-2xl transition-all duration-200"
					>
						<div className="mb-4">{box.icon}</div>
						<h3 className="text-xl font-bold mb-2 text-cyan-900">
							{box.title}
						</h3>
						<p className="text-gray-600 text-base">{box.desc}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default InfoBoxes;
