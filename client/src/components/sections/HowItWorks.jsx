import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardPaste, Zap, Share2 } from "lucide-react";

const STEPS = [
  {
    number: "1",
    icon: ClipboardPaste,
    title: "Paste your long URL",
    description: "Any link from anywhere. We handle the complexity.",
  },
  {
    number: "2",
    icon: Zap,
    title: "Get your short link",
    description: "Instant generation with optional custom back-half.",
  },
  {
    number: "3",
    icon: Share2,
    title: "Share and track",
    description: "Distribute with confidence and watch the data.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 px-6 bg-surface overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative">
          {/* Dashed connector line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] border-t border-dashed border-outline-variant/40 -z-10" />

          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center text-center group max-w-sm">
                <div className="font-headline italic text-8xl text-surface-variant group-hover:text-[#9cd0cc] transition-colors mb-[-2rem] select-none">
                  {step.number}
                </div>
                <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 border border-surface-container">
                  <Icon className="text-primary w-8 h-8" />
                </div>
                <h5 className="font-headline italic text-2xl mb-3 text-primary">{step.title}</h5>
                <p className="text-on-surface-variant text-sm px-6">{step.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default HowItWorks;
