"use client";
import useAuthToken from "@hooks/useAuthToken";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@components/ui/accordion";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { CustomLoader } from "@components/global/CustomLoader";

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
      toast.error("Failed to get all scheduled posts");
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
    <main className="h-screen flex bg-navBg text-white items-center flex-col justify-center gap-5 py-12 px-8 w-full">
      <h1 className="text-3xl font-medium">All Scheduled Posts</h1>

      <div className="w-full max-w-3xl">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : Object.keys(scheduledPosts).length > 0 ? (
          <Accordion type="single" collapsible>
            {Object.entries(scheduledPosts).map(([date, posts]) => (
              <AccordionItem key={date} value={date}>
                <AccordionTrigger>{date}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    {posts.map((post, index) => (
                      <div key={post._id || index} className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-300">{post.content}</p>
                        <span className="text-sm text-gray-500">Platform: {post.platform}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-gray-400">No scheduled posts available.</p>
        )}
      </div>
    </main>
  );
};

export default Page;
