"use client";
import { ChevronsUpDown } from "lucide-react";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import useAuthToken from "@hooks/useAuthToken";
import Link from "next/link";

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
      console.log("Response workspaces ", response.data);
      if (response.data.success) {
        setWorkspaces(response.data.data);
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
  }, [token]);

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

      console.log("response ", response.data?.data);
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

  return (
    <div className="flex flex-col items-start justify-between bg-darkBg px-4 py-6 shadow-sm text-white w-1/6 h-screen overflow-y-auto sticky top-0">
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
          <Sidebar_Card imageUrl={"/dashboard_icon.png"} text={"Dashboard"} />
          <Sidebar_Card imageUrl={"/Analytics.png"} text={"Anlaytics"} />
          <div className="w-full h-[1px] bg-white opacity-20" />
          <Sidebar_Card imageUrl={"/Create-Post.png"} text={"Create post"} />
          <Sidebar_Card
            onClickFunction={() => connectTwitter(workspaceId, router, token)}
            imageUrl={"/twitter.png"}
            text={"Connect X"}
          />
          <Sidebar_Card
            onClickFunction={() => connectLinkedin(workspaceId, router, token)}
            imageUrl={"/linkedIn.png"}
            text={"Connect LinkedIn"}
          />

          {singleWorkspace &&
            singleWorkspace.connectedAccounts?.map((account, i) => {
              if (account?.type === "twitter") {
                return (
                  <Sidebar_Card
                    key={i}
                    onClickFunction={() =>
                      disconnectTwitter(workspaceId, account?.userId, token)
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
                      disconnectLinkedIn(workspaceId, account?.userId, token)
                    }
                    imageUrl={"/linkedIn.png"}
                    text={account?.username}
                  />
                );
              }
            })}
        </div>
      </div>
      {loading ? (
        <h1 className="text-2xl font-semibold">Loading...</h1>
      ) : (
        <DropdownMenu className="w-full">
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary rounded-2xl w-full py-8 px-4 flex items-center gap-2 mt-auto">
              <Image
                alt="Paw image"
                src={"/pet-paw.png"}
                width={30}
                className="object-contain"
                height={30}
              />
              <span className="text-base text-white font-semibold">
                Dezign Plex
              </span>
              <ChevronsUpDown className="h-6 w-6 object-contain" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px] flex flex-col gap-4 items-center bg-headerBg">
            {workspaces?.length === 0 ? (
              <DropdownMenuItem className="text-2xl font-semibold text-white">
                No Workspaces Found
              </DropdownMenuItem>
            ) : (
              workspaces?.map((workspace, i) => (
                <Link
                  href={`/workspace/${workspace._id}`}
                  key={i}
                  className="text-white  border-0  rounded-sm px-6 py-4 "
                >
                  {workspace.name}
                </Link>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
