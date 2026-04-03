import { Pencil } from "lucide-react";

export default function ProfileCard({ user }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0">
        <span className="text-xl font-headline font-bold text-on-primary">
          {initials}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-headline italic text-foreground leading-tight">
          {user.name}
        </h2>
        <p className="text-sm font-mono text-secondary mt-0.5">{user.email}</p>

        {/* Stats pills */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs font-mono text-secondary bg-surface-container px-2.5 py-1 rounded-full">
            {user.totalLinks} Links
          </span>
          <span className="text-xs font-mono text-secondary bg-surface-container px-2.5 py-1 rounded-full">
            {user.totalClicks.toLocaleString()} Clicks
          </span>
          <span className="text-xs font-mono text-secondary bg-surface-container px-2.5 py-1 rounded-full">
            Member since {user.memberSince}
          </span>
        </div>
      </div>

      {/* Edit button */}
      <button className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:text-primary-container transition-colors shrink-0">
        <Pencil className="w-3 h-3" />
        Edit Profile
      </button>
    </div>
  );
}
