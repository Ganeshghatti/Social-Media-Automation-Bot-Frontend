import { UnifiedSidebar } from "@/components/global/UnifiedSidebar";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-navBg w-full">
      <UnifiedSidebar key={"dashboardSidebar"} />
      <main
        className="h-screen flex bg-navBg text-white items-center
   flex-col justify-between gap-7 flex-1 "
      >
        <CreatePostHeader />

        {children}
      </main>
    </div>

  );
};

export default DashboardLayout;
