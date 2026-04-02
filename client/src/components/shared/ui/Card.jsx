export default function Card({ children, className = "", padding = "p-6" }) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/40 rounded-2xl ${padding} ${className}`}
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      {children}
    </div>
  );
}
