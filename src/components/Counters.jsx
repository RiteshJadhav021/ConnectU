import React, { useRef } from "react";
import { useCountUpOnVisible } from "./useCountUpOnVisible";

const stats = [
  { label: "Alumni", value: 800 },
  { label: "Students", value: 1500 },
  { label: "Teachers", value: 80 }
];

const Counters = () => {
  const refs = stats.map(() => useRef());
  return (
    <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-br from-cyan-50 to-white">
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 sm:gap-10 md:gap-12">
        {stats.map((s, i) => {
          const count = useCountUpOnVisible(refs[i], s.value, 4000);
          return (
            <div
              key={i}
              className="flex flex-col items-center w-44 sm:w-48 md:w-56 mb-8 sm:mb-0"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-700 drop-shadow-lg mb-2">
                <span ref={refs[i]}>{count}+</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-semibold text-cyan-700 text-center">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Counters;
