"use client";
import React from "react";
import { Button } from "@/components/ui/button";

import { Plus, Settings, Trash } from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const [workspaces, setWorkspaces] = useState([]);

  const addWorkspace = () => {
    setWorkspaces([
      ...workspaces,
      { id: Date.now(), name: "New Workspace", socials: [] },
    ]);
  };

  const deleteWorkspace = (id) => {
    setWorkspaces(workspaces.filter((w) => w.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Workspaces</h2>
          <Button variant="ghost" size="icon" onClick={addWorkspace}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {/* Workspace List */}
        <div className="space-y-2">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg"
            >
              <span>{workspace.name}</span>
              <div className="space-x-1">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteWorkspace(workspace.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card key={workspace.id}>
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
                <CardDescription>Social Media Dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Example social media stats */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">Twitter</h3>
                    <p className="text-sm text-gray-500">1.2K Followers</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">Instagram</h3>
                    <p className="text-sm text-gray-500">2.5K Followers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
