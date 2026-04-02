const VARIANTS = {
  primary: "bg-primary text-on-primary hover:opacity-90",
  secondary: "border border-outline-variant text-foreground hover:border-primary",
  ghost: "text-secondary hover:text-primary",
  destructive: "border border-error/40 text-error hover:bg-error hover:text-on-error",
  accent: "bg-accent text-on-accent hover:opacity-90",
};

const SIZES = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  children,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full font-mono uppercase tracking-wide transition-all duration-200 inline-flex items-center justify-center gap-2 ${
        VARIANTS[variant]
      } ${SIZES[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
