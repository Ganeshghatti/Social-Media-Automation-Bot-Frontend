import SidebarDashboard from "@/components/global/SidebarDashboard";
import { SidebarTrigger } from "@components/ui/sidebar";
import React from "react";

const WorkspacesLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-navBg w-full">
      <SidebarDashboard />
      <main className="flex-1 flex flex-col">
        <div className="flex items-center p-4">
          <SidebarTrigger />
        </div>
        <div className="p-4 flex-1 flex flex-col items-center justify-center">{children}</div>
      </main>
    </div>
  );
};

export default WorkspacesLayout;
