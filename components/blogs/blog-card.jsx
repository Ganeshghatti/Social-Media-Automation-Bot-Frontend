"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogCard({ blogs = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.length > 0 &&
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
          >
            <div className="relative bg-[#6C5CE7] h-64">
              <Image
                src={blog.thumbnailImageUrl}
                fill
                alt={blog.thumbnailImageAlt || blog.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-black mb-3">
                {blog.title}
              </h3>
              <p className="text-black/90 mb-4">{blog.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-black/90 text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-black flex items-center hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}