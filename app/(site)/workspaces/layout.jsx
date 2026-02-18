import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import { UnifiedSidebar } from "@components/global/UnifiedSidebar";
import React from "react";

const WorkspacesLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-navBg w-full">
      <UnifiedSidebar />
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

export default WorkspacesLayout;