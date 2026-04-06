import { useState, useMemo, useEffect, useCallback } from "react";

import PageHeader from "../components/dashboard/PageHeader";
import StatCards from "../components/dashboard/StatCards";
import SearchFilters from "../components/dashboard/SearchFilters";
import LinksTable from "../components/dashboard/LinksTable";
import NewSnipModal from "../components/dashboard/NewSnipModal";
import api from "../services/api";

// ─── Status helper ─────────────────────────────────────────────────────────────
function getLinkStatus(link) {
  if (!link.expiresAt) return "No Expiry";
  return new Date(link.expiresAt) > new Date() ? "Active" : "Expired";
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [trends, setTrends] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(true);

  const fetchLinks = useCallback(async () => {
    try {
      const [{ data: urlData }, { data: statsData }] = await Promise.all([
        api.get("/url/my-urls"),
        api.get("/url/stats"),
      ]);
      setLinks(urlData);
      setTrends(statsData.trends || null);
    } catch (err) {
      console.error("Failed to fetch links", err);
    } finally {
      setLoadingLinks(false);
    }
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  // ── Derived stats ────────────────────────────────────────────────────────────
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
  async function handleDelete(id) {
    try {
      await api.delete(`/url/${id}`);
      setLinks((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Failed to delete link", err);
    }
  }

  async function handleNewSnip({ originalUrl, customAlias, expiresAt }) {
    const { data } = await api.post("/url/shorten", {
      originalUrl,
      ...(customAlias && { customAlias }),
      ...(expiresAt && { expiresAt }),
    });
    setLinks((prev) => [
      {
        _id: data._id || String(Date.now()),
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        clicks: 0,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt || undefined,
      },
      ...prev,
    ]);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="pt-28 pb-16 px-6 lg:px-10 xl:px-16">
        <div className="w-full max-w-[1400px] mx-auto">
          <PageHeader
            totalLinks={links.length}
            onNewSnip={() => setIsModalOpen(true)}
          />

          <StatCards stats={stats} trends={trends} />

          <SearchFilters
            search={search}
            onSearch={setSearch}
            activeFilter={filter}
            onFilter={setFilter}
          />

          {loadingLinks ? (
            <div className="py-20 text-center text-secondary font-mono text-xs uppercase tracking-widest">
              Loading…
            </div>
          ) : (
            <LinksTable
              links={filtered}
              onDelete={handleDelete}
              onNewSnip={() => setIsModalOpen(true)}
            />
          )}
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
