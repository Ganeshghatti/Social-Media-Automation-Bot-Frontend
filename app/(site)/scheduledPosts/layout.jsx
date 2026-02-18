import { UnifiedSidebar } from "@/components/global/UnifiedSidebar";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import React from "react";

const ScheduledPostsLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-navBg w-full">
      <UnifiedSidebar key={"scheduledPosts"} />
      <main 
        className="min-h-screen flex bg-navBg text-white items-center 
   flex-col justify-start gap-7 flex-1 md:ml-64" 
      > 
        <CreatePostHeader />

        {children}
      </main>
    </div>
  );
};

export default ScheduledPostsLayout;
