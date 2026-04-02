import { useState } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import SecurityForm from "../components/profile/SecurityForm";
import BillingSection from "../components/profile/BillingSection";
import PreferencesSection from "../components/profile/PreferencesSection";
import AccountOverview from "../components/profile/AccountOverview";
import DangerZone from "../components/profile/DangerZone";

const user = {
  name: "Rohit Kumar",
  email: "rohit@example.com",
  totalLinks: 24,
  totalClicks: 48291,
  memberSince: "Mar 2026",
  plan: "Free",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-8 pt-28 pb-24">
        {/* Page header */}
        <p className="font-mono text-xs uppercase tracking-widest text-outline">
          Profile
        </p>
        <h1 className="font-headline italic text-5xl text-primary mt-1">
          Your Account.
        </h1>

        <div className="grid grid-cols-12 gap-8 mt-10">
          {/* Left sidebar */}
          <div className="col-span-2">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main content */}
          <div className="col-span-7 space-y-4">
            <ProfileCard user={user} />

            {activeTab === "profile" && (
              <PersonalInfoForm user={user} onSave={console.log} />
            )}
            {activeTab === "security" && <SecurityForm />}
            {activeTab === "billing" && <BillingSection />}
            {activeTab === "preferences" && <PreferencesSection />}
          </div>

          {/* Right panel */}
          <div className="col-span-3 space-y-4">
            <AccountOverview
              stats={{
                totalLinks: user.totalLinks,
                totalClicks: user.totalClicks,
                memberSince: user.memberSince,
                plan: user.plan,
              }}
            />
            <DangerZone />
          </div>
        </div>
      </div>
    </div>
  );
}
