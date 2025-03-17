"use client";
import { ChevronsUpDown, PlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sidebar_Card } from "../single-workspace/Sidebar_Card";
import {
  connectLinkedin,
  connectTwitter,
  disconnectLinkedIn,
  disconnectTwitter,
} from "@functions/social";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";

export const Sidebar = ({ workspaceId, token }) => {
  const [singleWorkspace, setSingleWorkspace] = useState(null);
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const GetAllWorkspaces = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/workspace/get`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.data.success && singleWorkspace) {
        const filteredWorkspaces = response.data.data.filter(
          (workspace) => workspace.name !== singleWorkspace?.name
        );

        setWorkspaces(filteredWorkspaces);
      } else {
        setWorkspaces([]);
      }
    } catch (error) {
      console.log("Error in getting workspaces ", error);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    GetAllWorkspaces(token);
  }, [token, singleWorkspace]);

  const SingleWorkspaceData = useCallback(async (workspaceId, token) => {
    try {
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
    }
  }, []);

  useEffect(() => {
    if (workspaceId && token) {
      SingleWorkspaceData(workspaceId, token);
    }
  }, [workspaceId, token, SingleWorkspaceData]);

  if (loading) {
    return (
      <div className="flex flex-col items-start justify-between  bg-darkBg px-4 py-6 shadow-sm text-white w-[15%] no-scrollbar h-screen overflow-y-auto sticky top-0">
        <div className="flex w-full items-center gap-4">
          <Image
            src={"/sidebar_logo.png"}
            height={61}
            alt="Image"
            width={52}
            className="object-contain"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-white font-bold text-2xl">The</h1>
            <h1 className="text-white font-bold text-2xl">Squirrel</h1>
          </div>
        </div>

        <h1 className="text-xl text-white">Loading...</h1>
      </div>
    );
  }

  if (!singleWorkspace) {
    return null;
  }

  return (
    <div className="md:flex hidden flex-col items-start justify-between  bg-darkBg px-4 py-6 shadow-sm text-white w-[15%] no-scrollbar h-screen overflow-y-auto sticky top-0">
      <div className="flex flex-col gap-14 items-center w-full">
        <div className="flex w-full items-center gap-4">
          <Image
            src={"/sidebar_logo.png"}
            height={61}
            alt="Image"
            width={52}
            className="object-contain"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-white font-bold text-2xl">The</h1>
            <h1 className="text-white font-bold text-2xl">Squirrel</h1>
          </div>
        </div>
        <div className="flex flex-col w-full gap-3">
          <Sidebar_Card
            imageUrl={"/dashboard_icon.png"}
            text={"Dashboard"}
            onClickFunction={() => {
              router.push("/dashboard");
            }}
          />
          <Sidebar_Card
            imageUrl={"/Analytics.png"}
            text={"Analytics"}
            onClickFunction={() => {
              router.push("/analytics");
            }}
          />
          <div className="w-full h-[1px] bg-white opacity-40" />
          <Sidebar_Card
            imageUrl={"/Create-Post.png"}
            text={"Create post"}
            onClickFunction={() => {
              router.push(`/workspace/${workspaceId}`);
            }}
          />

          <Sidebar_Card
            imageUrl={"/edit.png"}
            text={"Edit Workspace"}
            onClickFunction={() => {
              router.push(`/workspace/${workspaceId}/edit`);
            }}
          />

          <Dialog>
            <DialogTrigger className="py-6 rounded-xl w-full  cursor-pointer px-3 flex items-center justify-start gap-3 bg-navBg  font-semibold">
              <PlusIcon />
              Add Account
            </DialogTrigger>
            <DialogContent className="w-[40vw] max-w-[40vw] h-[420px]  bg-headerBg flex border-transparent gap-2 items-start px-4 py-9">
              <DialogHeader>
                <DialogTitle className="text-white"></DialogTitle>
              </DialogHeader>
              <div className="w-full p-4 grid grid-cols-2 items-center gap-5">
                <Sidebar_Card
                  onClickFunction={() =>
                    connectTwitter(workspaceId, router, token)
                  }
                  imageUrl={"/twitter.png"}
                  text={"Connect X"}
                />
                <Sidebar_Card
                  onClickFunction={() =>
                    connectLinkedin(workspaceId, router, token)
                  }
                  imageUrl={"/linkedIn.png"}
                  text={"Connect LinkedIn"}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* {singleWorkspace &&
            singleWorkspace.connectedAccounts?.map((account, i) => {
              if (account?.type === "twitter") {
                return (
                  <Sidebar_Card
                    key={i}
                    onClickFunction={() =>
                      router.push(
                        `/workspace/${workspaceId}/${account?.type}/${account?.userId}`
                      )
                    }
                    imageUrl={"/twitter.png"}
                    text={account?.username}
                  />
                );
              } else {
                return (
                  <Sidebar_Card
                    key={i}
                    onClickFunction={() =>
                      router.push(
                        `/workspace/${workspaceId}/${account?.type}/${account?.userId}`
                      )
                    }
                    imageUrl={"/linkedIn.png"}
                    text={account?.username}
                  />
                );
              }
            })} */}
        </div>
      </div>
      {loading ? (
        <h1 className="text-2xl font-semibold">Loading...</h1>
      ) : (
        <DropdownMenu className="w-full mt-6">
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary rounded-2xl w-full py-8 px-4 flex items-center gap-2 mt-auto">
              {singleWorkspace?.icon && (
                <Image
                  alt="Paw image"
                  src={singleWorkspace?.icon}
                  width={30}
                  className="object-contain"
                  height={30}
                />
              )}

              <span className="text-base text-white font-semibold">
                {singleWorkspace?.name}
              </span>
              <ChevronsUpDown className="h-6 w-6 object-contain" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px] flex flex-col gap-4 items-center bg-headerBg">
            {workspaces?.length !== 0 &&
              workspaces?.map((workspace, i) => (
                <Link
                  href={`/workspace/${workspace._id}`}
                  key={i}
                  className="text-white  border-0  rounded-sm px-6 py-4 "
                >
                  {workspace.name}
                </Link>
              ))}

            <Link
              href={`/workspaces`}
              className="text-white  border-0  rounded-sm px-6 py-4 "
            >
              Manage Workspcaes
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
