"use client";
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

  const getAllPostsTwitter = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/workspace/posts/get/${workspaceId}/${socialMediaAccountId}?page=1`
      );
      const data = await response.data;

      if (response.status === 200) {
        if (data.success) {
          setFailed(data.data.failed);
          setPublished(data.data.published);
          setScheduled(data.data.scheduled);
        }
      }
    } catch (error) {
      console.log("Error ", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPostsTwitter();
  }, [socialMediaAccount, workspaceId, socialMediaAccountId]);

  return (
    <main className="h-screen flex items-start flex-col justify-start py-6 px-8 w-full ">
      <h1>All Social Media Posts</h1>

      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-6">
          <h1>Published Posts</h1>
          {published &&
            published.map((post, i) => {
              return <div key={i}></div>;
            })}
        </div>
      </div>
    </main>
  );
};

export default SocialMediaAccount;
