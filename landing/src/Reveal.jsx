import React, { useEffect, useRef, useState } from "react";

export default function Reveal({ children, delay = 0, y = 24, className = "", once = true }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(" + y + "px)",
        transition: "opacity .6s cubic-bezier(.22,.61,.36,1) " + delay + "ms, transform .6s cubic-bezier(.22,.61,.36,1) " + delay + "ms",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
