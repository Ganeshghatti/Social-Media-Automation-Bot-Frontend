"use client";
import useAuthToken from "@hooks/useAuthToken";
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { CustomLoader } from "@components/global/CustomLoader";
import { ScheduledCard } from "@components/scheduledPosts/ScheduledCard";
const Page = () => {
  const { workspaceId, socialMediaAccountId } = useParams();
  const [scheduledPosts, setScheduledPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthToken();

  const getAllSchedulesPosts = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/scheduled/posts/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data.success) {
        setScheduledPosts(response.data.data.groupedPosts || {});
      } else {
        throw new Error("Failed to retrieve scheduled posts.");
      }
    } catch (error) {
      // toast.error("Failed to get all scheduled posts");
      console.error("Error:", error);
      setError("Failed to load scheduled posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSchedulesPosts();
  }, [workspaceId, socialMediaAccountId, token]);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <main
      className="h-screen flex bg-navBg text-white items-center
     flex-col justify-start gap-7 py-16  px-8 flex-1 "
    >
      <h1 className="text-3xl font-medium">All Scheduled Posts</h1>

      <div className="w-full max-w-5xl">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : Object.keys(scheduledPosts).length > 0 ? (
          <div className=" py-4 px-5 flex items-start space-y-4 flex-col w-full  ">
            {Object.entries(scheduledPosts).map(([date, posts]) => {
              return (
                <div key={date} className="flex flex-col items-start space-y-2">
                  <h2 className="text-lg text-white ">{date}</h2>
                  <div className="flex flex-col gap-4 items-center flex-wrap w-full">
                    {posts &&
                      posts.length > 0 &&
                      posts?.map((post, i) => (
                        <ScheduledCard key={i} post={post} />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No scheduled posts available.</p>
        )}
      </div>
    </main>
  );
};

export default Page;
