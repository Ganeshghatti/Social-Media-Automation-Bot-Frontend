"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function BlogPage() {
  const params = useParams();
  const id = params?.id;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BLOG_API}/blog/public/posts/${id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch blog: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setBlog(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch blog data");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Blog Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          {error ||
            "The blog you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          href="/blog"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section with Cover Image */}
      <div className="w-full p-4">
        <Image
          src={blog.coverImageUrl}
          width={100}
          height={100}
          alt={blog.coverImageAlt || blog.title}
          className="w-full h-[500px] shadow-md object-cover rounded-md"
        />
        {/* <div className="absolute inset-0 bg-purple-600/60"></div> */}
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-2 overflow-hidden">
        <div className="rounded-lg p-6 md:p-8">
          {/* Description */}
          {/* {blog.description && (
            <div className="text-lg text-gray-700 mb-8 font-medium italic border-l-4 border-purple-500 pl-4">
              {blog.description}
            </div>
          )} */}

          <div className="">
            <h1 className="text-3xl md:text-4xl font-bold">{blog.title}</h1>

            {/* Categories */}
            {blog.categories && blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 ">
                {blog.categories.map((category) => (
                  <Link
                    href={`/blog/category/${category.slug}`}
                    key={category._id}
                    className="px-3 py-1 bg-black/20 backdrop-blur-sm text-black text-sm rounded-full hover:bg-white/30 transition"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Author and Date */}
            <div className="mt-2 text-sm flex items-center">
              {blog.authors && blog.authors.length > 0 ? (
                <span>
                  By {blog.authors.map((author) => author.username).join(", ")}
                </span>
              ) : null}
              {blog.createdAt && (
                <>
                  <span className="mx-2">•</span>
                  <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-10">
          <article
            className="prose prose-lg max-w-none prose-headings:text-black prose-a:text-blue-600"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
