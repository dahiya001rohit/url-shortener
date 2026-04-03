import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import SecurityForm from "../components/profile/SecurityForm";
import PreferencesSection from "../components/profile/PreferencesSection";
import AccountOverview from "../components/profile/AccountOverview";
import DangerZone from "../components/profile/DangerZone";
import PageHeader from "../components/shared/layout/PageHeader";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [urlStats] = useState({ totalLinks: 0, totalClicks: 0 });

  const profileUser = {
    name: user?.name || "",
    email: user?.email || "",
    totalLinks: user?.totalLinks ?? urlStats.totalLinks,
    totalClicks: user?.totalClicks ?? urlStats.totalClicks,
    memberSince: user?.memberSince
      ? new Date(user.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "—",
  };

  async function handleSave(formData) {
    const { data } = await api.patch("/user/profile", {
      name: formData.name,
      email: formData.email,
    });
    updateUser({ name: data.name, email: data.email });
  }

  async function handleChangePassword(currentPassword, newPassword) {
    await api.patch("/user/password", { currentPassword, newPassword });
  }

  async function handleDeleteAccount() {
    await api.delete("/user/account");
    await logout();
    navigate("/");
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-8 pt-28 pb-24">
        <PageHeader label="Profile" heading="Your Account." />

        <div className="grid grid-cols-12 gap-8 mt-10">
          <div className="col-span-2">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="col-span-7 space-y-4">
            <ProfileCard user={profileUser} />

            {activeTab === "profile" && (
              <PersonalInfoForm user={profileUser} onSave={handleSave} />
            )}
            {activeTab === "security" && (
              <SecurityForm onChangePassword={handleChangePassword} />
            )}
            {activeTab === "preferences" && <PreferencesSection />}
          </div>

          <div className="col-span-3 space-y-4">
            <AccountOverview
              stats={{
                totalLinks: profileUser.totalLinks,
                totalClicks: profileUser.totalClicks,
                memberSince: profileUser.memberSince,
              }}
            />
            <DangerZone onDelete={handleDeleteAccount} />
          </div>
        </div>
      </div>
    </div>
  );
}
