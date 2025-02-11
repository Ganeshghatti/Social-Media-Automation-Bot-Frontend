"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useAuthToken from "@hooks/useAuthToken";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";

const WorkspacePage = () => {
  const [loading, setLoading] = useState(false);
  const [singleWorkspace, setSingleWorkspace] = useState(null);
  const { workspaceId } = useParams();
  const token = useAuthToken();
  const router = useRouter();

  const SingleWorkspaceData = async (workspaceId, token) => {
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
      console.log("Response ", response);
      setSingleWorkspace(response.data.data);
    } catch (error) {
      console.log("Error ", error);
      setSingleWorkspace(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId && token) {
      SingleWorkspaceData(workspaceId, token);
    }
  }, [workspaceId, token]);

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

  return (
    <main>
      {loading ? (
        <h1 className="text-2xl font-semibold">Loading...</h1>
      ) : (
        singleWorkspace && (
          <div>
            <h2 className="text-2xl font-semibold">{singleWorkspace.name}</h2>
            <div className="flex gap-6 items-center">
              <Button
                onClick={() => router.push(`/workspace/${workspaceId}/edit`)}
              >
                Edit Workspace
              </Button>
              <Button onClick={deleteWorkspace}>Delete Workspace</Button>
            </div>
          </div>
        )
      )}
    </main>
  );
};

export default WorkspacePage;
