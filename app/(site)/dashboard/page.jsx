"use client";
import React, { use } from "react";
import { Button } from "@/components/ui/button";

import { Plus, Settings, Trash } from "lucide-react";
import { useState, useEffect } from "react";

import axios from "axios";

import useAuthStore from "@/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WorkspaceSettings from "@/feature/workspace/components/workspace-setting";
import WorkspaceCreate from "@/feature/workspace/components/workspace-create";

const Page = () => {
  const [workspaces, setWorkspaces] = useState([]);

  const [dialogState, setDialogState] = useState(false);

  const [createWorkSpaceState, setCreateWorkSpaceState] = useState(false);

  const [workSpaceData, setWorkSpaceData] = useState();

  const token = localStorage.getItem("token"); // Import useStore from your store file

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get(
          "https://api.bot.thesquirrel.site/workspace/get",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWorkspaces(response.data.data);
        console.log(response.data.data);
        console.log(token);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    fetchWorkspaces();
  }, []);

  const deleteWorkspace = async (workspaceId) => {
    try {
      await axios.delete(
        `https://api.bot.thesquirrel.site/workspace/delete/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkspaces(workspaces.filter((w) => w._id !== workspaceId));
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Workspaces</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCreateWorkSpaceState(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {/* Workspace List */}
        <div className="space-y-2">
          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="capitalize text-sm">{workspace.name}</span>
              <div className="space-x-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setWorkSpaceData(workspace);
                    setDialogState(true);
                    console.log(workspace);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteWorkspace(workspace._id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <WorkspaceSettings
            isOpen={dialogState}
            setIsOpen={setDialogState}
            workSpaceData={workSpaceData}
          />
          <WorkspaceCreate
            isOpen={createWorkSpaceState}
            setIsOpen={setCreateWorkSpaceState}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
