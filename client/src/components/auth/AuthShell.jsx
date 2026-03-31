/** Two-panel auth page wrapper */
export default function AuthShell({ children }) {
  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {children}
      {/* Subtle column divider */}
      <div className="fixed top-0 bottom-0 left-[41.66%] w-px bg-white/5 pointer-events-none hidden md:block" />
    </main>
  );
}
