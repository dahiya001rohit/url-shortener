import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StatCard({ label, value, trend, trendType = "neutral", icon: Icon, delay = 0 }) {
  const numeric = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const isFloat = typeof value === "number" && !Number.isInteger(value);
  const isString = typeof value === "string" && isNaN(Number(value.replace(/[^0-9.]/g, "")));

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isString || !numeric) {
      setCount(numeric || 0);
      return;
    }
    const frames = 45;
    const duration = 1200;
    const increment = numeric / frames;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numeric) {
        setCount(numeric);
        clearInterval(timer);
      } else {
        setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / frames);
    return () => clearInterval(timer);
  }, [numeric, isFloat, isString]);

  const displayValue = isString
    ? value
    : isFloat
    ? count.toFixed(1) + "%"
    : count.toLocaleString();

  const trendColors = {
    up: "text-green-600",
    down: "text-error",
    neutral: "text-secondary",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.4, ease: "easeOut" }}
      className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl flex flex-col gap-3"
      style={{ padding: "var(--density-card)", boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-secondary">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-secondary" />}
      </div>
      <p className="font-headline italic text-3xl text-primary">{displayValue}</p>
      {trend && (
        <p className={`text-xs font-body leading-relaxed ${trendColors[trendType]}`}>
          {trend}
        </p>
      )}
    </motion.div>
  );
}
