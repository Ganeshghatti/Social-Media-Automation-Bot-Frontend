"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Plus, X } from "lucide-react";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@components/ui/context-menu";

import WorkspaceSettings from "@feature/workspace/components/workspace-setting";
import WorkspaceCreate from "@feature/workspace/components/workspace-create";
import WorkspaceEdit from "@feature/workspace/components/workspace-edit";
import WorkSpacePost from "@feature/workspace/components/workspace-post";
import useAuthToken from "@hooks/useAuthToken";
import WorkSpaceThread from "@feature/workspace-thread";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import ImageFetch from "@feature/post/components/image-fetch" 

const Page = () => {
  const token = useAuthToken();
  const [workspaces, setWorkspaces] = useState([]);
  const [dialogState, setDialogState] = useState(false);
  const [createWorkSpaceState, setCreateWorkSpaceState] = useState(false);
  const [editWorkSpaceState, setEditWorkSpaceState] = useState(false);
  const [workSpaceData, setWorkSpaceData] = useState();
  const [accountId, setAccountId] = useState();
  const [workSpaceApiId, setWorkSpaceApiId] = useState();
  const [postType, setPostType] = useState("thread");
  const { user, fetchUser } = useUserStore();
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUser(token); // Pass token as parameter
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      if (!user.onboarding) {
        router.replace("/onboarding");
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (!token) return; // Ensure token is available before making requests

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
        setWorkSpaceApiId(response.data.data[0]._id);
        setAccountId(response.data.data[0].connectedAccounts[0]?.userId);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, [token]);

  const connectTwitter = async (workspaceId) => {
    try {
      const response = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/twitter/connect/${workspaceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push(response.data.data);
      setWorkSpaceApiId(workspaceId);
    } catch (error) {
      console.error("Error connecting Twitter:", error);
    }
  };

  const handleRemoveImage = (imageToRemove) => {
    setSelectedImages(selectedImages.filter(img => img.imageUrl !== imageToRemove.imageUrl));
  };

  const disconnectTwitter = async (workspaceId, userId) => {
    try {
      const response = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/twitter/disconnect/${workspaceId}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error disconnecting Twitter:", error);
    }
  };

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

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  if (user === null)
    return (
      <div className="flex flex-col">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );

    useEffect(() => {
      console.log(selectedImages)
    },[selectedImages])
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
        <Accordion type="single" key={24} collapsible>
          {workspaces.map((workspace, index) => (
            <ContextMenu key={`context-menu-${workspace._id}`}>
              <ContextMenuTrigger key={`context-menu-trigger-${workspace._id}`}>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      setWorkSpaceData(workspace);
                      setEditWorkSpaceState(true);
                    }}
                  >
                    Edit
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => {
                      setWorkSpaceData(workspace);
                      setDialogState(true);
                    }}
                  >
                    Settings
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => deleteWorkspace(workspace._id)}
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
                <AccordionItem
                  value={`item-${index}`}
                  key={workspace._id}
                  className="items-center border-2 border-gray-200 justify-between p-1 px-5 hover:bg-gray-100 rounded-lg"
                >
                  <AccordionTrigger className="flex">
                    <span className="capitalize text-sm">{workspace.name}</span>
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <div className="space-y-2">
                      {workspace.connectedAccounts.length > 0 ? (
                        workspace.connectedAccounts.map((account, index) => (
                          <div
                            key={index}
                            className="flex flex-col gap-2 border p-4 rounded-md"
                          >
                            <h3 className="text-md font-bold capitalize">
                              {account.type}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Username : {account.username}
                            </p>
                            <p className="capitalize text-sm text-muted-foreground">
                              Status : {account.isConnected ? "true" : "false"}
                            </p>
                            <Button
                              variant="outline"
                              className="w-full flex items-center gap-2"
                              onClick={() => {
                                disconnectTwitter(
                                  workspace._id,
                                  account.userId
                                );
                              }}
                            >
                              Disconnect
                            </Button>
                          </div>
                        ))
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full flex items-center gap-2"
                          onClick={() => {
                            connectTwitter(workspace._id);
                          }}
                        >
                          Connect Twitter
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </ContextMenuTrigger>
            </ContextMenu>
          ))}
        </Accordion>
        <WorkspaceSettings
          isOpen={dialogState}
          setIsOpen={setDialogState}
          workSpaceData={workSpaceData}
        />
        <WorkspaceCreate
          isOpen={createWorkSpaceState}
          setIsOpen={setCreateWorkSpaceState}
        />
        <WorkspaceEdit
          isOpen={editWorkSpaceState}
          setIsOpen={setEditWorkSpaceState}
          workSpaceData={workSpaceData}
        />
      </div>
      <div className="flex-1 p-4">
        <div className="mb-4">
          <label htmlFor="postType" className="mr-2">
            Select Post Type:
          </label>
          <select
            id="postType"
            value={postType}
            onChange={handlePostTypeChange}
            className="border p-2 rounded"
          >
            <option value="thread">Thread</option>
            <option value="post">Post</option>
          </select>
        </div>
        {postType === "thread" ? (
          <WorkSpaceThread accountId={accountId} workSpaceId={workSpaceApiId} />
        ) : (
          <WorkSpacePost accountId={accountId} workSpaceId={workSpaceApiId} />
        )}
        {selectedImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Selected Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(image)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

         <ImageFetch 
  token={token} 
  selectedImages={selectedImages} 
  setSelectedImages={setSelectedImages} 
/>
      </div>
     
    </div>
  );
};

export default Page;
