import { CreatePostHeader } from "@/components/CreatePost/CreatePostHeader";
import { UnifiedSidebar } from "@/components/global/UnifiedSidebar";
import React from "react";

const AnalyticsLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-navBg w-full">
      <UnifiedSidebar key={"Analytics"} />
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

export default AnalyticsLayout;
