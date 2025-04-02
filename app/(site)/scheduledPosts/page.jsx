"use client";
import useAuthToken from "@hooks/useAuthToken";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CustomLoader } from "@components/global/CustomLoader";
import { ScheduledCard } from "@components/scheduledPosts/ScheduledCard";
import { toast } from "sonner";
const Page = () => {
  const [scheduledPosts, setScheduledPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthToken();

  const getAllSchedulesPosts = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.tech/scheduled/posts/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data.success) {
        setScheduledPosts(response.data.data.groupedPosts || {});
      } else {
        toast.error("Failed to retrieve scheduled posts.");
        throw new Error("Failed to retrieve scheduled posts.");
      }
    } catch (error) {
      toast.error("Failed to retrieve scheduled posts.");

      console.error("Error:", error);
      setError("Failed to load scheduled posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSchedulesPosts();
  }, [token]);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <>
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
    </>
  );
};

export default Page;
