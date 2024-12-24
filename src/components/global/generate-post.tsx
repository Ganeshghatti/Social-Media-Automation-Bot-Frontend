"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "https://api.bot.thesquirrel.site";

interface GeneratePostProps {
  type: string;
  fetchPosts: () => void;
}

const GeneratePost: React.FC<GeneratePostProps> = ({ type, fetchPosts }) => {
  const [loading, setLoading] = useState(false);

  const generatePost = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `${BACKEND_URI}/${type}/instant-post`,
        {}, // Empty body as no data needs to be sent
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        await fetchPosts(); // Refresh the posts list
      } else {
        throw new Error(response.data.message || "Failed to generate post");
      }
    } catch (error) {
      console.error("Error generating post:", error);

      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to generate post";
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={generatePost} disabled={loading} className="min-w-[150px]">
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Generating...
        </span>
      ) : (
        "Generate Post"
      )}
    </Button>
  );
};

export default GeneratePost;
