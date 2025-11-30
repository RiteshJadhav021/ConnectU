import React, { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Alumni, Google",
    text: "ConnectU helped me land my dream job and stay connected with my college friends!",
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Priya Singh",
    role: "Student",
    text: "I found a great mentor and internship through this platform. Highly recommended!",
    img: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Dr. R. Mehta",
    role: "Teacher",
    text: "A wonderful way to guide students and see their progress even after graduation.",
    img: "https://randomuser.me/api/portraits/men/65.jpg"
  }
];

const Testimonials = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.2 }
    );
    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-br from-white via-cyan-50 to-indigo-100 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200 opacity-30 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200 opacity-30 rounded-full blur-3xl animate-pulse z-0" />
      <h2 className="relative z-10 text-4xl font-extrabold text-center text-indigo-700 mb-14 drop-shadow-lg tracking-tight">
        What Our Users Say
      </h2>
      <div className="relative z-10 flex flex-wrap justify-center gap-10">
        {testimonials.map((t, i) => (
          <div
            key={i}
            ref={el => (cardsRef.current[i] = el)}
            className="testimonial-card bg-white/70 backdrop-blur-lg border border-white/50 shadow-2xl rounded-3xl px-8 py-8 max-w-xs flex flex-col items-center transition-all duration-300 hover:-translate-y-3 hover:shadow-indigo-300/50 hover:scale-105 group opacity-0"
          >
            {/* Quote icon */}
            <svg className="w-8 h-8 text-cyan-400 mb-3 group-hover:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.17 6.17A5.001 5.001 0 0 0 2 11v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-2a5 5 0 0 0-2.83-4.46zM19.17 6.17A5.001 5.001 0 0 0 14 11v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-2a5 5 0 0 0-2.83-4.46z" />
            </svg>
            <img
              src={t.img}
              alt={t.name}
              className="w-20 h-20 rounded-full mb-4 border-4 border-cyan-200 object-cover shadow-lg"
            />
            <p className="text-gray-800 italic mb-4 text-center text-lg leading-relaxed font-medium">
              “{t.text}”
            </p>
            <div className="font-bold text-indigo-700 text-lg mb-1 tracking-wide">{t.name}</div>
            <div className="text-sm text-cyan-600 font-semibold">{t.role}</div>
          </div>
        ))}
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          opacity: 1 !important;
          animation: fadeInUp 0.8s cubic-bezier(.23,1.02,.58,.99) both;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
