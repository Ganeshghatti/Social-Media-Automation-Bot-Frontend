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
    <div className="flex h-screen  overflow-x-hidden      bg-navBg w-screen max-w-screen ">
      <UnifiedSidebar token={token} workspaceId={workspaceId} key={"workspaceSidebar"} />
      <main className="min-h-screen flex bg-navBg text-white items-center     flex-col justify-start gap-7 flex-1 md:ml-64"        >
        <CreatePostHeader />
        {children}
      </main>
    </div>);
};


export default WorkspaceLayout;  