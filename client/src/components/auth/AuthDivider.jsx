export default function AuthDivider({ label = "or" }) {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-grow border-t border-outline-variant opacity-20" />
      <span className="flex-shrink mx-4 text-[10px] font-mono uppercase tracking-widest text-outline/60">
        {label}
      </span>
      <div className="flex-grow border-t border-outline-variant opacity-20" />
    </div>
  );
}
