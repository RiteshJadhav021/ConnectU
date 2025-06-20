import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gradient-to-br from-cyan-800 via-blue-900 to-indigo-950 text-white pt-16 pb-8 px-4 mt-12 relative overflow-hidden">
    <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-cyan-200 pb-10">
      {/* Logo & About */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center mb-2">
          <span className="flex items-center bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-cyan-900 px-4 py-2 rounded-2xl shadow-lg font-black italic transform -skew-x-6 border-2 border-white text-3xl">
            <svg className="w-8 h-8 mr-2 text-cyan-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" /><path d="M8 15l4-4 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Connect<span className="ml-2 text-4xl text-cyan-900 font-black not-italic tracking-widest drop-shadow-lg">U</span>
          </span>
        </div>
        <p className="text-cyan-100 text-base leading-relaxed font-medium">Empowering students and alumni to connect, share, and grow together.<br/>Your journey, your network, your future.<br/><span className="inline-block mt-3 px-4 py-2 bg-cyan-800/70 rounded-xl text-yellow-300 font-semibold text-sm tracking-wide shadow-lg">Building Bridges for Success</span></p>
      </div>
      {/* Contact Info */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-2xl mb-3 text-yellow-300">Contact</h4>
        <ul className="space-y-2 text-cyan-100 text-base">
          <li><span className="font-semibold">Email:</span> <a href="mailto:support@connectu.com" className="underline hover:text-yellow-300">support@connectu.com</a></li>
          <li><span className="font-semibold">Phone:</span> <a href="tel:+919876543210" className="underline hover:text-yellow-300">+91 98765 43210</a></li>
          <li><span className="font-semibold">Address:</span> <span className="text-cyan-200">123 College Road, City, India</span></li>
        </ul>
        <div className="mt-4">
          <span className="inline-block px-4 py-2 bg-yellow-400/90 text-cyan-900 font-bold rounded-full text-base shadow-lg">We'd love to hear from you!</span>
        </div>
      </div>
      {/* Social Media */}
      <div className="flex flex-col gap-4 items-center md:items-end">
        <h4 className="font-bold text-2xl mb-3 text-yellow-300">Follow Us</h4>
        <div className="flex space-x-5 mt-2 bg-white/10 rounded-xl p-4 shadow-lg">
          <a href="#" className="hover:scale-125 transition-transform duration-200" aria-label="Instagram"><svg className="w-9 h-9 text-pink-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a6 6 0 1 1 0 12a6 6 0 0 1 0-12zm0 1.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9zm6.25 1.25a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"/></svg></a>
          <a href="#" className="hover:scale-125 transition-transform duration-200" aria-label="LinkedIn"><svg className="w-9 h-9 text-blue-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75s1.75.79 1.75 1.75s-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47c-1.5 0-1.73 1.18-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.85-1.54c3.05 0 3.62 2.01 3.62 4.62v4.69z"/></svg></a>
          <a href="#" className="hover:scale-125 transition-transform duration-200" aria-label="Twitter"><svg className="w-9 h-9 text-cyan-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775a4.932 4.932 0 0 0 2.165-2.724a9.864 9.864 0 0 1-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482A13.94 13.94 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.573a4.903 4.903 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084a4.928 4.928 0 0 0 4.6 3.419a9.868 9.868 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009c0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg></a>
        </div>
        <div className="mt-6">
          <span className="inline-block px-4 py-2 bg-cyan-800/90 text-yellow-300 font-semibold rounded-xl text-base shadow-lg">Stay Connected for Updates</span>
        </div>
      </div>
    </div>
    <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 pb-4 text-cyan-200 text-lg font-semibold">
      <span>&copy; {new Date().getFullYear()} ConnectU. All rights reserved.</span>
      <span>Made with <span className="text-pink-400">&#10084;</span> for students & alumni.</span>
    </div>
  </footer>
);

export default Footer;
