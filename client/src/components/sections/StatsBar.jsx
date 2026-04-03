import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const STATS = [
  { target: 2, suffix: "M+", label: "Links Shortened", decimal: 0 },
  { target: 45, suffix: "k+", label: "Active Creators", decimal: 0 },
  { target: 99.9, suffix: "%", label: "Uptime Reliability", decimal: 1 },
];

function CountUp({ target, decimal }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(progress * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setValue(target);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return <>{value.toFixed(decimal)}</>;
}

export function StatsBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="bg-primary relative overflow-hidden py-24"
    >
      <div className="absolute inset-0 opacity-10 editorial-grid" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 xl:px-16 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-0 text-center">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`py-8 ${i < STATS.length - 1 ? "md:border-r border-white/10" : ""}`}
          >
            <h3 className="font-headline italic text-7xl md:text-8xl text-[#FFB95F] leading-none mb-2 tabular-nums">
              {visible ? <CountUp target={stat.target} decimal={stat.decimal} /> : "0"}
              {stat.suffix}
            </h3>
            <p className="font-label uppercase tracking-widest text-on-primary-container text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export default StatsBar;
