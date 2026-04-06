import { User, Lock } from "lucide-react";
import SidebarNav from "../shared/layout/SidebarNav";

const PROFILE_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
];

export default function ProfileSidebar({ activeTab, onTabChange }) {
  return (
    <SidebarNav
      tabs={PROFILE_TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}
