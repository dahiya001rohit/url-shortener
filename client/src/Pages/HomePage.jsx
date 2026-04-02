import { useState } from "react";
import GreetingHeader from "../components/home/GreetingHeader";
import QuickSnipCard from "../components/home/QuickSnipCard";
import HomeStatCards from "../components/home/HomeStatCards";
import RecentActivity from "../components/home/RecentActivity";
import QuickActions from "../components/home/QuickActions";
import TopLinks from "../components/home/TopLinks";
import NewSnipModal from "../components/dashboard/NewSnipModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-8 pt-28 pb-24">
        <GreetingHeader />

        <QuickSnipCard onSnip={(url) => console.log("snip:", url)} />

        <HomeStatCards />

        <div className="grid grid-cols-12 gap-6 mt-8">
          <div className="col-span-12 lg:col-span-8">
            <RecentActivity />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <QuickActions onNewSnip={() => setIsModalOpen(true)} />
          </div>
        </div>

        <TopLinks />
      </div>

      <NewSnipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          console.log("new snip from home:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
