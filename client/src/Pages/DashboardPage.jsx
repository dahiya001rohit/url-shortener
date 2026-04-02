import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  FolderOpen,
  Archive,
  Settings,
  User,
} from "lucide-react";

import PageHeader from "../components/dashboard/PageHeader";
import StatCards from "../components/dashboard/StatCards";
import SearchFilters from "../components/dashboard/SearchFilters";
import LinksTable from "../components/dashboard/LinksTable";
import NewSnipModal from "../components/dashboard/NewSnipModal";

// ─── Seed data ─────────────────────────────────────────────────────────────────
const FAKE_DATA = [
  {
    _id: "1",
    originalUrl: "https://www.notion.so/my-workspace/product-roadmap-2026",
    shortCode: "prd-26",
    userId: "user1",
    clicks: 1284,
    createdAt: "2026-01-15T10:30:00Z",
    expiresAt: "2026-12-31T00:00:00Z", // Active (future)
  },
  {
    _id: "2",
    originalUrl: "https://figma.com/file/abc123/design-system-v2",
    shortCode: "ds-v2",
    userId: "user1",
    clicks: 847,
    createdAt: "2026-02-03T14:22:00Z",
    // No expiry
  },
  {
    _id: "3",
    originalUrl:
      "https://github.com/rohitdahiya/url-shortener/blob/main/README.md",
    shortCode: "snip-gh",
    userId: "user1",
    clicks: 312,
    createdAt: "2025-03-10T09:15:00Z",
    expiresAt: "2025-06-30T00:00:00Z", // Expired
  },
  {
    _id: "4",
    originalUrl: "https://www.loom.com/share/product-demo-walkthrough-final",
    shortCode: "demo-lm",
    userId: "user1",
    clicks: 2401,
    createdAt: "2026-01-28T16:45:00Z",
    // No expiry
  },
  {
    _id: "5",
    originalUrl:
      "https://linear.app/team/project/sprint-42-retrospective-notes",
    shortCode: "sprt-42",
    userId: "user1",
    clicks: 56,
    createdAt: "2025-04-01T11:00:00Z",
    expiresAt: "2025-05-01T00:00:00Z", // Expired
  },
];

// ─── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Analytics", icon: BarChart2, href: "/analytics/overview" },
  { label: "Collections", icon: FolderOpen, href: "#" },
  { label: "Archive", icon: Archive, href: "#" },
];

// ─── Status helper ─────────────────────────────────────────────────────────────
function getLinkStatus(link) {
  if (!link.expiresAt) return "No Expiry";
  return new Date(link.expiresAt) > new Date() ? "Active" : "Expired";
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [links, setLinks] = useState(FAKE_DATA);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // ── Derived stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = links.filter((l) => getLinkStatus(l) !== "Expired").length;
    const expired = links.filter((l) => getLinkStatus(l) === "Expired").length;
    return {
      totalLinks: links.length,
      totalClicks: links.reduce((sum, l) => sum + l.clicks, 0),
      activeLinks: active,
      expiredLinks: expired,
    };
  }, [links]);

  // ── Filtered links ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return links
      .filter((l) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          l.shortCode.toLowerCase().includes(q) ||
          l.originalUrl.toLowerCase().includes(q)
        );
      })
      .filter((l) => {
        if (filter === "All") return true;
        const status = getLinkStatus(l);
        if (filter === "Active") return status === "Active";
        if (filter === "Expired") return status === "Expired";
        if (filter === "No Expiry") return status === "No Expiry";
        return true;
      });
  }, [links, search, filter]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleDelete(id) {
    setLinks((prev) => prev.filter((l) => l._id !== id));
  }

  function handleNewSnip({ originalUrl, customAlias, expiresAt }) {
    const newLink = {
      _id: String(Date.now()),
      originalUrl,
      shortCode: customAlias || Math.random().toString(36).slice(2, 8),
      userId: "user1",
      clicks: 0,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt || undefined,
    };
    setLinks((prev) => [newLink, ...prev]);
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-outline-variant/20 bg-surface-container-lowest left-0 top-0 bottom-0 pt-28 pb-6 px-3">
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const isActive =
              href !== "#" && window.location.pathname === href;
            return (
              <Link
                key={label}
                to={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-secondary hover:bg-surface-container hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-outline-variant/20 pt-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-secondary hover:bg-surface-container hover:text-foreground transition-colors">
            <Settings className="w-4 h-4 shrink-0" />
            Settings
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-secondary hover:bg-surface-container hover:text-foreground transition-colors"
          >
            <User className="w-4 h-4 shrink-0" />
            Account
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 pt-28 pb-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <PageHeader
            totalLinks={links.length}
            onNewSnip={() => setIsModalOpen(true)}
          />

          <StatCards stats={stats} />

          <SearchFilters
            search={search}
            onSearch={setSearch}
            activeFilter={filter}
            onFilter={setFilter}
          />

          <LinksTable
            links={filtered}
            onDelete={handleDelete}
            onNewSnip={() => setIsModalOpen(true)}
          />
        </div>
      </main>

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      <NewSnipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewSnip}
      />
    </div>
  );
}
