"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
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

import {
  connectTwitter,
  disconnectTwitter,
  connectLinkedin,
  disconnectLinkedIn,
} from "@functions/social/index";

import WorkspaceSettings from "@feature/workspace/components/workspace-setting";
import WorkspaceCreate from "@feature/workspace/components/workspace-create";
import WorkspaceEdit from "@feature/workspace/components/workspace-edit";
import WorkSpacePost from "@feature/workspace/components/workspace-post";
import useAuthToken from "@hooks/useAuthToken";
import WorkSpaceThread from "@feature/workspace-thread";
import { useUserStore } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import Link from "next/link";
import { Label } from "@components/ui/label";
import { Select } from "@components/ui/select";

const WorkspacePage = () => {
  const { workspaceId } = useParams();
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const [singleWorkspace, setSingleWorkspace] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser(token); // Pass token as parameter
    }
  }, [token, fetchUser]);

  useEffect(() => {
    if (user) {
      if (!user.onboarding) {
        router.replace("/onboarding");
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (!token) return;

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

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const SingleWorkspaceData = useCallback(async (workspaceId, token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/workspace/get/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingleWorkspace(response.data.data);
    } catch (error) {
      console.log("Error ", error);
      setSingleWorkspace(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (workspaceId && token) {
      SingleWorkspaceData(workspaceId, token);
    }
  }, [workspaceId, token, SingleWorkspaceData]);

  const deleteWorkspace = async () => {
    if (!token) return;

    try {
      const response = await axios.delete(
        `https://api.bot.thesquirrel.site/workspace/delete/${workspaceId}`, // FIXED DELETE ENDPOINT
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("message", response.data.message);

      if (response.data.success) {
        router.push("/workspaces");
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  if (user === null)
    return (
      <div className="flex flex-col">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
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
        <Accordion type="single" collapsible>
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
                  <ContextMenuItem onClick={() => deleteWorkspace()}>
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
                            {account?.type === "linkedin" ? (
                              <Button
                                variant="outline"
                                className="w-full flex items-center gap-2"
                                onClick={() => {
                                  disconnectLinkedIn(
                                    workspace._id,
                                    account.userId,
                                    token
                                  );
                                }}
                              >
                                Disconnect
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="w-full flex items-center gap-2"
                                onClick={() => {
                                  disconnectTwitter(
                                    workspace._id,
                                    account.userId,
                                    token
                                  );
                                }}
                              >
                                Disconnect
                              </Button>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full flex items-center gap-2"
                                >
                                  Links to Connect
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Connect With Social Accounts
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="w-full grid grid-cols-3 gap-5 mt-5">
                                  <Button
                                    variant="outline"
                                    className="w-full flex items-center gap-2"
                                    onClick={() => {
                                      connectTwitter(
                                        workspace._id,
                                        router,
                                        setWorkSpaceApiId,
                                        token
                                      );
                                    }}
                                  >
                                    Connect Twitter
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="w-full flex items-center gap-2"
                                    onClick={() => {
                                      connectLinkedin(
                                        workspace._id,
                                        router,
                                        setWorkSpaceApiId,
                                        token
                                      );
                                    }}
                                  >
                                    Connect Linkedin
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        ))
                      ) : (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full flex items-center gap-2"
                              >
                                Social Links to Connect
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Connect With Social Accounts
                                </DialogTitle>
                              </DialogHeader>
                              <div className="w-full grid grid-cols-3 gap-5 mt-5">
                                <Button
                                  variant="outline"
                                  className="w-full flex items-center gap-2"
                                  onClick={() => {
                                    connectTwitter(
                                      workspace._id,
                                      router,
                                      setWorkSpaceApiId,
                                      token
                                    );
                                  }}
                                >
                                  Connect Twitter
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full flex items-center gap-2"
                                  onClick={() => {
                                    connectLinkedin(workspace._id,router,setWorkSpaceApiId,token);
                                  }}
                                >
                                  Connect Linkedin
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <Link href={`/workspace/${workspaceId}/twitter/${accountId}`}>
                  <Button className="w-full flex items-center gap-2 mt-6">
                    go to twitter page
                  </Button>
                </Link>
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
          <Label htmlFor="postType" className="mr-2">
            Select Post Type:
          </Label>
          <Select
            id="postType"
            value={postType}
            onChange={handlePostTypeChange}
            className="border p-2 rounded"
          >
            <option value="thread">Thread</option>
            <option value="post">Post</option>
          </Select>
        </div>
        {postType === "thread" ? (
          <WorkSpaceThread accountId={accountId} workSpaceId={workSpaceApiId} />
        ) : (
          <WorkSpacePost accountId={accountId} workSpaceId={workSpaceApiId} />
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
