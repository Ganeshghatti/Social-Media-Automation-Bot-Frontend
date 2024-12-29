"use client";
import React from "react";
import { Post } from "@/types/type";
import axios from "axios";
import { useState, useEffect } from "react";
import GeneratePost from "../global/generate-post";
import TwitterCard from "./twitter-card";


const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "https://api.bot.thesquirrel.site";

type post = {
  date: string;
  posts: Post[];
};

const PostTable = () => {
  const [posts, setPosts] = useState<post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/";
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BACKEND_URI}/twitter/get-all-posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && Array.isArray(response.data?.data)) {
        console.log(response.data.data);
        setPosts(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch posts. Please try again later."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-lg">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <GeneratePost type="twitter" fetchPosts={fetchPosts} />
      <div className="mt-6">
        {posts?.map((dateGroup: post, i: number) =>
          <div key={i} className="mt-10"> 
            <p className="text-xl font-semibold">{dateGroup.date}</p>
            <div className="grid mt-6 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {
              dateGroup.posts.map((post: Post) => (
                <TwitterCard key={post._id} post={post} />
              ))
            }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostTable;
