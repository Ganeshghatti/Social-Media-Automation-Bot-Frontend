"use client";
import { Sidebar } from "@components/CreatePost/Sidebar";
import { SidebarTrigger } from "@components/ui/sidebar";
import useAuthToken from "@hooks/useAuthToken";
import { useParams } from "next/navigation";
import React from "react";

const WorkspaceLayout = ({ children }) => {
  const { workspaceId } = useParams();
  const token = useAuthToken();
  return (
    <div className="flex  bg-navBg w-full">
      <Sidebar workspaceId={workspaceId} token={token} />
      {children}
    </div>
  );
};

export default WorkspaceLayout;
