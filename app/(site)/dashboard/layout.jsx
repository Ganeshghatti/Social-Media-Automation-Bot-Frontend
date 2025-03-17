import SidebarDashboard from "@/components/global/SidebarDashboard";
import React from "react";

const DashboardLayout = ({children}) => {
  return (
    <div className="flex min-h-screen bg-navBg w-full">
      <SidebarDashboard />
      {children}
    </div>
  );
};

export default DashboardLayout;
