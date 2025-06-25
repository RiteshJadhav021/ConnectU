import { useEffect, useRef, useState } from "react";

export function useCountUpOnVisible(target, end, duration = 1500) {
  const [count, setCount] = useState(0);
  const frame = useRef();
  const startTimestamp = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!target.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(target.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    function animateCount(ts) {
      if (!startTimestamp.current) startTimestamp.current = ts;
      const progress = Math.min((ts - startTimestamp.current) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        frame.current = requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    }
    frame.current = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(frame.current);
  }, [hasAnimated, end, duration]);

  return count;
}
