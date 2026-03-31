import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link2, MousePointerClick, CheckCircle2, XCircle } from "lucide-react";

function StatCard({ icon, label, value, sub, delay }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    }
    const frames = 40;
    const duration = 1200;
    const increment = value / frames;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / frames);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="bg-surface-container-lowest rounded-xl p-5 flex flex-col gap-3"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-secondary">
          {label}
        </span>
        <span className="text-on-surface-variant">{icon}</span>
      </div>
      <p className="text-3xl font-headline text-foreground">
        {count.toLocaleString()}
      </p>
      <p className="text-xs font-body text-secondary">{sub}</p>
    </motion.div>
  );
}

export default function StatCards({ stats }) {
  const total = stats.totalLinks || 1;
  const activePercent = Math.round((stats.activeLinks / total) * 100);
  const expiredPercent = Math.round((stats.expiredLinks / total) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<Link2 className="w-4 h-4" />}
        label="Total Links"
        value={stats.totalLinks}
        sub="+3 this week"
        delay={0}
      />
      <StatCard
        icon={<MousePointerClick className="w-4 h-4" />}
        label="Total Clicks"
        value={stats.totalClicks}
        sub="+2,847 this week"
        delay={0.05}
      />
      <StatCard
        icon={<CheckCircle2 className="w-4 h-4 text-primary" />}
        label="Active Links"
        value={stats.activeLinks}
        sub={`${activePercent}% of total`}
        delay={0.1}
      />
      <StatCard
        icon={<XCircle className="w-4 h-4 text-error" />}
        label="Expired Links"
        value={stats.expiredLinks}
        sub={`${expiredPercent}% of total`}
        delay={0.15}
      />
    </div>
  );
}
