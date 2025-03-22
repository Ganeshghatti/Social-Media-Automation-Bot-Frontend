"use client";
import { useUserStore } from "@/store/userStore";
import useAuthToken from "@hooks/useAuthToken";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const WorkspacesPage = () => {
  const token = useAuthToken();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (user === null) return; // Wait for user to load
    if (!user?.onboarding) {
      router.replace("/onboarding");
    }
  }, [user, router]);
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

  return (
    <div className="h-screen flex flex-1 w-full items-center bg-navBg justify-center ">
      {loading ? (
        <h1 className="text-2xl font-semibold">Loading...</h1>
      ) : (
        <div className="md:px-10 py-12 flex flex-col items-center  md:grid md:grid-cols-3 gap-4  ">
          {workspaces.length === 0 ? (
            <h1 className="text-2xl font-semibold text-white">
              No Workspaces Found
            </h1>
          ) : (
            workspaces.map((workspace, i) => (
              <Link
                href={`/workspace/${workspace._id}`}
                key={i}
                className="border-white text-white flex items-center space-x-2 border-2  rounded-sm px-3 py-4 gap-3 "
              >
                {workspace && workspace?.icon && (
                  <Image
                    src={workspace.icon}
                    alt="dummy"
                    height={60}
                    width={60}
                    className="h-10 w-10 object-contain"
                  />
                )}
                {workspace.name}
              </Link>
            ))
          )}

          <Link
            href={`/workspace/create`}
            className="border-white text-white flex items-center space-x-2 border-2  rounded-sm px-6 py-4 "
          >
            <PlusIcon className="h-10 w-10 " />
            Add Workspace
          </Link>
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;
