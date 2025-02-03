"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // to use `params` in the app directory
import useAuthToken from "@/hooks/useAuthToken";

const WorkspacePage = () => {
  const [loading, setLoading] = useState(false);
  const [singleWorkspace, setSingleWorkspace] = useState(null);
  const { workspaceId } = useParams(); // Get the workspaceId from params
  const token = useAuthToken();

  const SingleWorkspaceData = async (workspaceId, token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/workspace/get/${workspaceId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Response ", response);
      const { data } = response.data;
      setSingleWorkspace(data);
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

  return (
    <main>
      {loading ? (
        <h1 className="text-2xl font-semibold">Loading...</h1>
      ) : (
        singleWorkspace && (
          <div>
            <h2 className="text-2xl font-semibold">{singleWorkspace.name}</h2>
          </div>
        )
      )}
    </main>
  );
};

export default WorkspacePage;
