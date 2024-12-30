"use client";
import React, { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { Post } from "@/types/type";
import Image from "next/image";
import DeleteModal from "./delete-modal";
import UpdateModal from "./update-modal";
import axios from "axios";

const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "https://api.bot.thesquirrel.site";

const TwitterCard = ({ post, fetchPosts }: { post: Post, fetchPosts: () => void }) => {
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = async () => {
    setIsDelete(true);
    try {
      const deleteResponse = await axios.delete(
        `${BACKEND_URI}/twitter/delete-post`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
          data: {
            id: post._id,
          },
        }
      );



      if (deleteResponse.data.success) {
        await fetchPosts()
        setIsDelete(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDelete(false);
    }
  };

  return (
    <div className="rounded-xl shadow-sm bg-lightSecondary dark:bg-darkSecondary p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold">@Ganeshtx</p>
        <FaXTwitter className="text-black dark:text-white text-2xl" />
      </div>
      <div className="mt-2 flex flex-row gap-3 items-center ">
        {/* <span className="text-black/70 dark:text-[#A3A3A3]"> 
        {
          new Date(post.createdAt).toDateString()
        }</span> */}
        <div className="flex flex-row gap-1 items-center">
          <span className="w-2 h-2 aspect-square rounded-full inline-block mr-1 bg-black/30 dark:bg-[#A3A3A3]"></span>
          <span className="text-green-700">{post.status && post.status}</span>
        </div>
      </div>

      <div>
        {post.img && (
          <Image
            src={post.img}
            width={500}
            height={500}
            alt="Post Image"
            className="aspect-square object-cover rounded-md my-4"
          />
        )}
      </div>

      <p className="mt-3 text-black/70 dark:text-[#A3A3A3] line-clamp-3">
        {post.text}{" "}
      </p>
      <div className="mt-4 w-full flex justify-end">
        {post.status == "scheduled" && (
          <div className="flex gap-4">
            <UpdateModal
              initialData={{
                id: post._id,
                text: post.text,
                img: post.img,
                tobePublishedAt: post.tobePublishedAt as string,
              }}
              fetchPost={fetchPosts}
            />
            <DeleteModal
              itemName="Post"
              onDelete={handleDelete}
              isLoading={isDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterCard;
