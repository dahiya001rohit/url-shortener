import { useState } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import SecurityForm from "../components/profile/SecurityForm";
import BillingSection from "../components/profile/BillingSection";
import PreferencesSection from "../components/profile/PreferencesSection";
import AccountOverview from "../components/profile/AccountOverview";
import DangerZone from "../components/profile/DangerZone";
import PageHeader from "../components/shared/layout/PageHeader";

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
        <PageHeader label="Profile" heading="Your Account." />

        <div className="grid grid-cols-12 gap-8 mt-10">
          <div className="col-span-2">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="col-span-7 space-y-4">
            <ProfileCard user={user} />

            {activeTab === "profile" && (
              <PersonalInfoForm user={user} onSave={console.log} />
            )}
            {activeTab === "security" && <SecurityForm />}
            {activeTab === "billing" && <BillingSection />}
            {activeTab === "preferences" && <PreferencesSection />}
          </div>

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
