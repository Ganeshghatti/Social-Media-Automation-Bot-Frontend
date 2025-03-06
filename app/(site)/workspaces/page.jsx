"use client";
import useAuthToken from "@hooks/useAuthToken";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const WorkspacesPage = () => {
  const token = useAuthToken();
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

  return (
    <div className="h-screen flex items-center justify-center ">
      {loading ? (
        <h1 className="text-2xl font-semibold">Loading...</h1>
      ) : (
        <div className="px-10 py-12 grid grid-cols-3 gap-4  ">
          {workspaces.length === 0 ? (
            <h1 className="text-2xl font-semibold">No Workspaces Found</h1>
          ) : (
            workspaces.map((workspace, i) => (
              <Link
                href={`/workspace/${workspace._id}`}
                key={i}
                className="border-gray-900 border-2  rounded-sm px-6 py-4 "
              >
                {workspace.name}
              </Link>
            ))
          )}

          <Link
            href={`/workspace/create`}
            className="border-gray-900 border-2 rounded-sm px-6 py-4 "
          >
            Add Workspace
          </Link>
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;
