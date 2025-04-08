"use client";
import { UnifiedSidebar } from "@/components/global/UnifiedSidebar";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import useAuthToken from "@hooks/useAuthToken";
import { useParams } from "next/navigation";
import React from "react";

const WorkspaceLayout = ({ children }) => {
  const { workspaceId } = useParams();
  const token = useAuthToken();
  return (
    <div className="flex h-screen  overflow-x-hidden 
    bg-navBg w-screen max-w-screen ">
      <UnifiedSidebar token={token} workspaceId={workspaceId} key={"workspaceSidebar"} />
      <main
        className="min-h-screen flex  flex-1 text-white items-center
       flex-col justify-start gap-3 mb-5  "
      >
        <CreatePostHeader />

        {children}
      </main>
    </div>
  );
};

export default WorkspaceLayout;
