const VARIANTS = {
  active: "bg-primary/10 text-primary border border-primary/20",
  expired: "bg-error/10 text-error border border-error/20",
  noExpiry: "bg-surface-low text-secondary border border-outline-variant",
  new: "bg-accent/20 text-on-accent border border-accent/30",
  premium: "bg-primary text-on-primary",
};

const DOTS = {
  active: "bg-primary",
  expired: "bg-error",
  noExpiry: "bg-secondary",
  new: "bg-accent",
  premium: "bg-on-primary",
};

export default function Badge({ variant = "active", children, dot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${VARIANTS[variant]}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOTS[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
