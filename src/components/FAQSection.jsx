import React, { useState } from "react";

const faqs = [
  {
    q: "How do I sign up?",
    a: "Click the Sign Up button and fill in your details. Choose your role and follow the instructions."
  },
  {
    q: "Is ConnectU free to use?",
    a: "Yes, ConnectU is free for all students, alumni, teachers, and TPOs."
  },
  {
    q: "How can I contact alumni?",
    a: "After signing up, use the search and messaging features to connect with alumni."
  },
  {
    q: "Can I update my profile later?",
    a: "Yes, you can edit your profile information anytime after logging in."
  }
];

const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10 drop-shadow-lg">Frequently Asked Questions</h2>
      <div className="max-w-2xl mx-auto">
        {faqs.map((f, i) => (
          <div key={i} className="mb-4 border-b border-cyan-100">
            <button
              className="w-full text-left py-4 px-2 font-semibold text-lg text-cyan-700 focus:outline-none flex justify-between items-center"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {f.q}
              <span className="ml-2 text-indigo-500 text-3xl font-bold leading-none select-none" style={{ minWidth: '1.5em', display: 'inline-block', textAlign: 'center' }}>{open === i ? '-' : '+'}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-gray-700 animate-fade-in">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
