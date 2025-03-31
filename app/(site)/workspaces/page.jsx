"use client";
import { handleApiError } from "@/lib/ErrorResponse";
import { useUserStore } from "@/store/userStore";
import { CustomLoader } from "@components/global/CustomLoader";
import useAuthToken from "@hooks/useAuthToken";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const WorkspacesPage = () => {
  const token = useAuthToken();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (user === null && token) {
      fetchUser(token).then(() => {
        setLoading(false); // Resolve loading after fetch completes
      });
    } else if (user === null && !token) {
      setLoading(false);
    } else if (user && !user?.onboarding) {
      router.replace("/onboarding");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, router, fetchUser, token]);

  useEffect(() => {
    if (user === null) return;
    if (!user?.onboarding) {
      router.replace("/onboarding");
    }
    setLoading(false);
  }, [user, router]);

  // Fetch workspaces
  const GetAllWorkspaces = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.tech/workspace/get`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("workspace ", response);
      if (response.data.success) {
        setWorkspaces(response.data.data);
      } else {
        throw new Error(
          response.data.error?.message || "Failed to Fetch Workspaces "
        );
      }
    } catch (error) {
      const errorMessage = handleApiError(error, "Failed to fetch workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (user !== null) {
      GetAllWorkspaces(token);
    }
  }, [token, user]);

  // Show loader while loading or user is null
  if (loading || user === null) {
    return <CustomLoader />;
  }

  return (
    <>
      <div className="md:px-10 py-12 w-full flex-1 flex justify-center items-center">
        {workspaces.length === 0 ? (
          // No workspaces case: Fully centered
          <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
            <h1 className="text-2xl font-semibold text-white">
              No Workspaces Found
            </h1>
            <Link
              href={`/workspace/create`}
              className="border-white text-white flex items-center space-x-2 border-2 rounded-sm px-6 py-4"
            >
              <PlusIcon className="h-10 w-10" />
              Add Workspace
            </Link>
          </div>
        ) : (
          // Workspaces exist case: Display them in the center
          <div className="flex flex-wrap justify-center gap-6">
            {workspaces.map((workspace, i) => (
              <Link
                href={`/workspace/${workspace._id}`}
                key={i}
                className="border-white text-white flex items-center space-x-2 border-2 rounded-sm px-12 py-4 gap-3"
              >
                {workspace?.icon && (
                  <Image
                    src={workspace.icon}
                    alt="Workspace Icon"
                    height={60}
                    width={60}
                    className="h-10 w-10 object-contain"
                  />
                )}
                {workspace.name}
              </Link>
            ))}
            {/* Always show Add Workspace button */}
            <Link
              href={`/workspace/create`}
              className="border-white text-white flex items-center space-x-2 border-2 rounded-sm px-6 py-4"
            >
              <PlusIcon className="h-10 w-10" />
              Add Workspace
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkspacesPage;
