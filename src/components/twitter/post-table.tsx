"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useState, useEffect } from "react";
import GeneratePost from "../global/generate-post";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI || "https://api.bot.thesquirrel.site";

type Post = {
  _id: string;
  text: string;
  img: string;
  createdAt: string;
  isPublished: boolean;
  tobePublishedAt: string | null;
  imageData?: string;
};

const PostTable = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        window.location.href = "/";
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${BACKEND_URI}/twitter/get-all-posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data?.success && Array.isArray(response.data?.posts)) {
        setPosts(response.data.posts);
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
      <GeneratePost type="twitter" fetchPosts={fetchPosts}/>
      <Table className="border mt-10 border-muted rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Text</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled For</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post._id}>
              <TableCell>
                {post.img || post.imageData ? (
                  <img
                    src={post.imageData || post.img}
                    alt="Post"
                    className="w-12 h-12 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}
              </TableCell>
              <TableCell className="max-w-md">
                <div className="line-clamp-3">{post.text}</div>
              </TableCell>
              <TableCell>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    post.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.isPublished ? "Published" : "Draft"}
                </span>
              </TableCell>
              <TableCell>
                {post.tobePublishedAt
                  ? new Date(post.tobePublishedAt).toLocaleDateString("en-US", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "Not scheduled"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PostTable;