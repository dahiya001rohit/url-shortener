import { useState, useEffect, useCallback } from "react";
import GreetingHeader from "../components/home/GreetingHeader";
import QuickSnipCard from "../components/home/QuickSnipCard";
import HomeStatCards from "../components/home/HomeStatCards";
import RecentActivity from "../components/home/RecentActivity";
import QuickActions from "../components/home/QuickActions";
import TopLinks from "../components/home/TopLinks";
import NewSnipModal from "../components/dashboard/NewSnipModal";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function HomePage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [allLinks, setAllLinks] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [urlsRes, statsRes, activityRes] = await Promise.all([
        api.get("/url/my-urls"),
        api.get("/url/stats"),
        api.get("/activity/recent"),
      ]);
      setAllLinks(urlsRes.data);
      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      console.error("Failed to fetch home data", err);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleQuickSnip(url) {
    const { data } = await api.post("/url/shorten", { originalUrl: url });
    fetchData();
    return data;
  }

  async function handleNewSnip({ originalUrl, customAlias, expiresAt }) {
    await api.post("/url/shorten", {
      originalUrl,
      ...(customAlias && { customAlias }),
      ...(expiresAt && { expiresAt }),
    });
    fetchData();
    setIsModalOpen(false);
  }

  const topLinks = [...allLinks].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

  return (
    <div className="bg-background min-h-screen">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 xl:px-16 pt-28 pb-24">
        <GreetingHeader name={user?.name || "there"} />

        <QuickSnipCard onSnip={handleQuickSnip} />

        <HomeStatCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          <div className="col-span-12 lg:col-span-8">
            <RecentActivity activity={activity} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <QuickActions onNewSnip={() => setIsModalOpen(true)} />
          </div>
        </div>

        <TopLinks links={topLinks} />
      </div>

      <NewSnipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewSnip}
      />
    </div>
  );
}
