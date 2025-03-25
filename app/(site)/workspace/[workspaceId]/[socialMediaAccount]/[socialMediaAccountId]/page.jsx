"use client";
import useAuthToken from "@hooks/useAuthToken";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SocialMediaAccount = () => {
  const { socialMediaAccount, workspaceId, socialMediaAccountId } = useParams();
  const [scheduled, setScheduled] = useState([]);
  const [failed, setFailed] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthToken();

  const getAllPostsTwitter = async () => {
    if (!token) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/workspace/posts/get/${workspaceId}/${socialMediaAccountId}?page=1`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;

      if (response.status === 200) {
        console.log("Published ", data);

        if (data.success) {
          setFailed(data.data.failed);
          setPublished(data.data.published);
          setScheduled(data.data.scheduled);
        }
      }
    } catch (error) {
      toast.error("Failed to get all twitter posts");
      console.log("Error ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPostsTwitter();
  }, [socialMediaAccount, workspaceId, socialMediaAccountId, token]);

  return (
    <main
      className="h-screen flex bg-navBg text-white items-center 
    flex-col justify-center gap-5  py-12 px-8 w-full  "
    >
      <h1 className="text-3xl text-white font-medium">
        All Social Media Posts
      </h1>

      <div className="flex  flex-col gap-6 my-4 w-full h-screen flex-1">
        <div className="flex flex-col gap-6">
          <h1>Published Posts</h1>
          <div className="grid grid-cols-3 items-center gap-3">
            {published &&
              published.map((post, i) => {
                return (
                  <div
                    className="flex flex-col p-3 items-center justify-center gap-3  border-white/60 cursor-pointer border   "
                    key={i}
                  >
                    <h1 className="text-lg text-white ">{post?.content}</h1>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SocialMediaAccount;
