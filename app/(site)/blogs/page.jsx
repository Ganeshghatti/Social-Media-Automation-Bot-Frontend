"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/blogs/blog-card";
import Navbar from "@components/global/navbar";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BLOG_API}/blog/public/posts`
        );
        console.log("the blog list ", response )
        setBlogs(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load blogs. Please try again later.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <main className=" ">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#6C5CE7] mb-4">
            Squirrel Blogs
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the latest tips, updates, and insights on{" "}
            <span className="text-[#6C5CE7]">Linkedin</span> content creation
            with <span className="text-[#6C5CE7]">thesquirrel.tech</span>. Stay
            inspired and grow your Linkedin with us.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Blogs
          </h2>

          {loading && (
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6C5CE7] border-r-transparent"></div>
            </div>
          )}
          {!loading && error && (
            <div className="text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {!loading && !error && blogs.length === 0 && (
            <div className="text-center">
              <p className="text-gray-600">No posts found.</p>
            </div>
          )}
          {!loading && !error && blogs.length > 0 && <BlogCard blogs={blogs} />}
        </div>
      </div>
    </main>
  );
}
