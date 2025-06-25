import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapSignupAnimation() {
  const formRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRefs = useRef([]);
  const errorRefs = useRef([]);
  const selectRef = useRef(null);

  useEffect(() => {
    // Form entrance
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      );
    }
    // Image entrance
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -60, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
    }
    // Button hover
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { scale: 1 });
      buttonRef.current.addEventListener("mouseenter", () => {
        gsap.to(buttonRef.current, { scale: 1.05, boxShadow: "0 8px 24px 0 rgba(67,56,202,0.18)", duration: 0.2 });
      });
      buttonRef.current.addEventListener("mouseleave", () => {
        gsap.to(buttonRef.current, { scale: 1, boxShadow: "", duration: 0.2 });
      });
    }
    // Input focus
    inputRefs.current.forEach((input) => {
      if (!input) return;
      input.addEventListener("focus", () => {
        gsap.to(input, { scale: 1.03, borderColor: "#6366f1", duration: 0.18 });
      });
      input.addEventListener("blur", () => {
        gsap.to(input, { scale: 1, borderColor: "#d1d5db", duration: 0.18 });
      });
    });
    // Dropdown open (on focus)
    if (selectRef.current) {
      selectRef.current.addEventListener("focus", () => {
        gsap.to(selectRef.current, { scale: 1.03, borderColor: "#06b6d4", duration: 0.18 });
      });
      selectRef.current.addEventListener("blur", () => {
        gsap.to(selectRef.current, { scale: 1, borderColor: "#d1d5db", duration: 0.18 });
      });
    }
    // Error message animation (fade/slide in)
    errorRefs.current.forEach((err) => {
      if (err) {
        gsap.fromTo(err, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
    });
  }, []);

  return { formRef, imageRef, buttonRef, inputRefs, errorRefs, selectRef };
}
