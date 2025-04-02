"use client";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import { Sidebar } from "@components/CreatePost/Sidebar";
import useAuthToken from "@hooks/useAuthToken";
import { useParams } from "next/navigation";
import React from "react";

const WorkspaceLayout = ({ children }) => {
  const { workspaceId } = useParams();
  const token = useAuthToken();
  return (
    <div className="flex h-screen  overflow-x-hidden 
    bg-navBg w-screen max-w-screen ">
      <Sidebar workspaceId={workspaceId} token={token} />
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
