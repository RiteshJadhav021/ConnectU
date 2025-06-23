import React from "react";

const companies = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
];

const ITCompaniesMarquee = () => {
  return (
    <div className="relative w-full h-[120px] bg-gray-50 overflow-hidden flex items-center justify-center mt-8">
      <div
        className="flex items-center w-full gap-12 animate-marquee"
        style={{ animation: 'marquee 18s linear infinite' }}
      >
        {companies.map((company, idx) => (
          <img
            key={idx}
            src={company.logo}
            alt={company.name}
            className="h-[60px] mx-4 grayscale-[0.2] drop-shadow-md transition duration-200 hover:grayscale-0 hover:drop-shadow-lg"
          />
        ))}
        {/* Repeat for smooth loop */}
        {companies.map((company, idx) => (
          <img
            key={"repeat-" + idx}
            src={company.logo}
            alt={company.name}
            className="h-[60px] mx-4 grayscale-[0.2] drop-shadow-md transition duration-200 hover:grayscale-0 hover:drop-shadow-lg"
          />
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ITCompaniesMarquee;
