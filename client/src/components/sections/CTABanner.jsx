import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function CTABanner() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-40 px-6 text-center bg-surface relative overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <h2 className="font-headline italic text-6xl md:text-8xl text-primary mb-12 tracking-tighter">
          Ready to shorten?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto px-12 py-5 bg-on-tertiary-container text-on-tertiary rounded font-medium transition-all text-lg btn-interact animate-pulse-slow"
          >
            Start for Free
          </button>
          <button
            onClick={() => navigate("/demo")}
            className="w-full sm:w-auto px-12 py-5 border border-primary text-primary rounded font-medium transition-all text-lg btn-interact hover:bg-primary/5"
          >
            View Demo
          </button>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-t from-primary-container/5 to-transparent -z-0" />
    </section>
  );
}

export default CTABanner;
