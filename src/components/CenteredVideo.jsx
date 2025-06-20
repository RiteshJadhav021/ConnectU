import React, { useEffect, useState } from 'react';

const words = [
  'Job',
  'Careers',
  'Internships',
  'Networking',
  'Web Development',
  'AI & ML',
];

const colors = [
  'text-cyan-400',
  'text-yellow-400',
  'text-pink-400',
  'text-indigo-400',
  'text-green-400',
  'text-orange-400',
];

const CenteredVideo = () => {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const typingSpeed = 90;
  const pauseTime = 1200;

  useEffect(() => {
    let timeout;
    if (!deleting && charIdx < words[wordIdx].length) {
      timeout = setTimeout(() => {
        setDisplayed(words[wordIdx].slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, typingSpeed);
    } else if (!deleting && charIdx === words[wordIdx].length) {
      timeout = setTimeout(() => setDeleting(true), pauseTime);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(words[wordIdx].slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, 40);
    } else if (deleting && charIdx === 0) {
      timeout = setTimeout(() => {
        setWordIdx((wordIdx + 1) % words.length);
        setColorIdx((colorIdx + 1) % colors.length);
        setDeleting(false);
      }, 400);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, colorIdx]);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-cyan-100 pt-[72px] relative">
      <div className="w-full max-w-full mx-auto aspect-video bg-black relative">
        <div className="relative w-full h-0 pb-[56.25%]">
          <video
            src="/Video1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
          {/* Typewriter Text Overlay */}
          <div className="absolute top-1/2 left-1/2 w-full flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-lg text-center text-white">
              1-on-1  <span className={`transition-colors duration-300 ${colors[colorIdx]}`}>{displayed}<span className="animate-pulse">|</span></span> Mentorship
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenteredVideo;
