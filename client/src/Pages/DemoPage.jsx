import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  FolderOpen,
  Archive,
  Settings,
  User,
  Link2,
  Copy,
  Check,
  Trash2,
} from "lucide-react";

import PageHeader from "../components/dashboard/PageHeader";
import StatCards from "../components/dashboard/StatCards";
import SearchFilters from "../components/dashboard/SearchFilters";
import NewSnipModal from "../components/dashboard/NewSnipModal";
import Badge from "../components/shared/ui/Badge";

// ─── Demo banner ──────────────────────────────────────────────────────────────
function DemoBanner() {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-10 flex items-center justify-center px-4"
      style={{ background: "#FFB95F" }}>
      <span className="text-xs font-mono text-[#2A1700] mr-3">
        ✦ You're viewing a live demo — Sign up free to start shortening your own links
      </span>
      <button
        onClick={() => navigate("/register")}
        className="bg-primary text-white rounded-full px-4 py-1.5 text-xs font-mono shrink-0"
      >
        Create Account →
      </button>
    </div>
  );
}

// ─── Fake data ────────────────────────────────────────────────────────────────
const INITIAL_LINKS = [
  {
    _id: "demo1",
    originalUrl: "https://archdaily.com/modernist-residence-2026",
    shortCode: "arch-daily",
    clicks: 12482,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
  },
  {
    _id: "demo2",
    originalUrl: "https://figma.com/file/XkP9mN2/design-system-v3",
    shortCode: "figma-kit",
    clicks: 8341,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
  },
  {
    _id: "demo3",
    originalUrl: "https://openai.com/research/gpt4-technical-report",
    shortCode: "gpt-paper",
    clicks: 4127,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
  },
  {
    _id: "demo4",
    originalUrl: "https://medium.com/@rohit/my-first-blog-post",
    shortCode: "old-post",
    clicks: 892,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "demo5",
    originalUrl: "https://rohit.dev/projects/snip-url-shortener",
    shortCode: "portfolio",
    clicks: 2841,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
  },
  {
    _id: "demo6",
    originalUrl: "https://twitter.com/rohitdahiya/status/1234567890",
    shortCode: "tweet-01",
    clicks: 1923,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "demo7",
    originalUrl: "https://notion.so/my-product-roadmap-2026",
    shortCode: "roadmap",
    clicks: 3241,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
  },
];

function getLinkStatus(link) {
  if (!link.expiresAt) return "No Expiry";
  return new Date(link.expiresAt) > new Date() ? "Active" : "Expired";
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/demo" },
  { label: "Analytics", icon: BarChart2, href: "#" },
  { label: "Collections", icon: FolderOpen, href: "#" },
  { label: "Archive", icon: Archive, href: "#" },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-primary text-white rounded-xl px-4 py-3 font-mono text-xs z-[200]">
      {message}
    </div>
  );
}

// ─── Custom LinksTable wrapper for demo ───────────────────────────────────────
// We need to intercept analytics navigation to /demo/analytics/:shortCode
// and delete to show toast instead of calling API.
// We do this by overriding the onDelete prop and using demo-aware TableRow.

function getStatus(link) {
  if (!link.expiresAt) return "noExpiry";
  return new Date(link.expiresAt) > new Date() ? "active" : "expired";
}

const STATUS_LABELS = { active: "Active", expired: "Expired", noExpiry: "No Expiry" };

function DemoTableRow({ link, onDelete, onToast }) {
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const statusVariant = getStatus(link);

  function handleCopy() {
    navigator.clipboard.writeText(`https://snip.ly/${link.shortCode}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    } else {
      onDelete(link._id);
      onToast("In demo mode — sign up to manage real links");
      setDeleteConfirm(false);
    }
  }

  return (
    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors group">
      <td className="py-3.5 pl-4 pr-3">
        <span className="font-mono text-sm text-primary">snip.ly/{link.shortCode}</span>
      </td>
      <td className="py-3.5 px-3 max-w-xs">
        <span className="text-sm text-secondary truncate block" title={link.originalUrl}>
          {link.originalUrl}
        </span>
      </td>
      <td className="py-3.5 px-3">
        <span className="text-sm font-mono text-foreground">{link.clicks.toLocaleString()}</span>
      </td>
      <td className="py-3.5 px-3">
        <Badge variant={statusVariant}>{STATUS_LABELS[statusVariant]}</Badge>
      </td>
      <td className="py-3.5 pl-3 pr-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCopy} title="Copy short link" className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-primary transition-all">
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => navigate(`/demo/analytics/${link.shortCode}`)}
            title="View analytics"
            className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-primary transition-all"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            title={deleteConfirm ? "Click again to confirm" : "Delete"}
            className={`p-1.5 rounded-lg transition-all ${deleteConfirm ? "bg-error/10 text-error hover:bg-error/20" : "hover:bg-surface-container text-secondary hover:text-error"}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {deleteConfirm && (
            <span className="text-xs text-error font-mono ml-1 whitespace-nowrap">Delete?</span>
          )}
        </div>
      </td>
    </tr>
  );
}

function DemoLinksTable({ links, onDelete, onToast, onNewSnip }) {
  if (links.length === 0) {
    return (
      <div className="py-20 text-center">
        <Link2 className="w-8 h-8 text-outline mx-auto mb-4" />
        <p className="text-secondary font-mono text-sm">No links match your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-outline-variant/20">
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline-variant/20 bg-surface-container-lowest">
            <th className="py-3 pl-4 pr-3 text-left text-[10px] font-mono uppercase tracking-widest text-secondary">Short URL</th>
            <th className="py-3 px-3 text-left text-[10px] font-mono uppercase tracking-widest text-secondary">Destination</th>
            <th className="py-3 px-3 text-left text-[10px] font-mono uppercase tracking-widest text-secondary">Clicks</th>
            <th className="py-3 px-3 text-left text-[10px] font-mono uppercase tracking-widest text-secondary">Status</th>
            <th className="py-3 pl-3 pr-4 text-left text-[10px] font-mono uppercase tracking-widest text-secondary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <DemoTableRow key={link._id} link={link} onDelete={onDelete} onToast={onToast} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DemoPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  function showToast(message) {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  }

  const stats = useMemo(() => {
    const active = links.filter((l) => getLinkStatus(l) !== "Expired").length;
    const expired = links.filter((l) => getLinkStatus(l) === "Expired").length;
    return {
      totalLinks: links.length,
      totalClicks: links.reduce((sum, l) => sum + (l.clicks || 0), 0),
      activeLinks: active,
      expiredLinks: expired,
    };
  }, [links]);

  const filtered = useMemo(() => {
    return links
      .filter((l) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return l.shortCode.toLowerCase().includes(q) || l.originalUrl.toLowerCase().includes(q);
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

  function handleDelete(id) {
    setLinks((prev) => prev.filter((l) => l._id !== id));
  }

  async function handleNewSnip({ originalUrl, customAlias }) {
    const shortCode = customAlias || Math.random().toString(36).slice(2, 8);
    setLinks((prev) => [
      {
        _id: `demo-${Date.now()}`,
        originalUrl,
        shortCode,
        clicks: 0,
        createdAt: new Date().toISOString(),
        expiresAt: null,
      },
      ...prev,
    ]);
    showToast("✦ Sign up to get a real short link!");
  }

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />

      {/* Offset for demo banner (40px) + navbar (~72px) */}
      <div className="flex pt-10">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-outline-variant/20 bg-surface-container-lowest fixed left-0 top-10 bottom-0 pt-20 pb-6 px-3">
          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
              const isActive = href === "/demo";
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
          <div className="border-t border-outline-variant/20 pt-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-secondary hover:bg-surface-container hover:text-foreground transition-colors">
              <Settings className="w-4 h-4 shrink-0" />
              Settings
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-secondary hover:bg-surface-container hover:text-foreground transition-colors">
              <User className="w-4 h-4 shrink-0" />
              Account
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-56 pt-20 pb-16 px-6 lg:px-10">
          {/* Demo notice */}
          <div className="mb-6 bg-accent/10 border border-accent/30 rounded-2xl px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-mono text-accent">
              ✦ Demo mode — this data is not real. Sign up to create your own links.
            </span>
            <button
              onClick={() => navigate("/register")}
              className="text-xs font-mono text-primary underline ml-4 shrink-0"
            >
              Sign up free →
            </button>
          </div>

          <div className="max-w-5xl mx-auto">
            <PageHeader totalLinks={links.length} onNewSnip={() => setIsModalOpen(true)} />
            <StatCards stats={stats} />
            <SearchFilters
              search={search}
              onSearch={setSearch}
              activeFilter={filter}
              onFilter={setFilter}
            />
            <DemoLinksTable
              links={filtered}
              onDelete={handleDelete}
              onToast={showToast}
              onNewSnip={() => setIsModalOpen(true)}
            />
          </div>
        </main>
      </div>

      <NewSnipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewSnip}
      />

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
