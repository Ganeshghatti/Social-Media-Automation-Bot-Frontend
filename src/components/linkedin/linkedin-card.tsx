import React from "react";
import { Post } from "@/types/type";
import { FaLinkedin } from "react-icons/fa6";
import Image from "next/image";

const LinkedinCard = ({ post }: { post: Post }) => {
  console.log("post data from the card",post)
  return (
    <div className="rounded-xl shadow-sm bg-lightSecondary dark:bg-darkSecondary p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold">@Ganeshtx</p>
        <FaLinkedin className="text-blue-600 text-2xl" />
      </div>
      <div className="mt-2 flex flex-row gap-3 items-center ">
        {/* <span className="text-black/70 dark:text-[#A3A3A3]"> 
        {
          new Date(post.createdAt).toDateString()
        }</span> */}
        <div className="flex flex-row gap-1 items-center">
          <span className="w-2 h-2 aspect-square rounded-full inline-block mr-1 bg-black/30 dark:bg-[#A3A3A3]"></span>
          <span className="text-green-700">
            {
              post.tobePublishedAt ? "Scheduled" : "Published"
            }
          </span>
        </div>
      </div>

      <div>
        {
          post.img && (
            <Image src={post.img} width={500} height={500} alt="Post Image" className="aspect-square object-cover rounded-md my-4" />
          )
        }
      </div>

      <p className="mt-3 text-black/70 dark:text-[#A3A3A3] line-clamp-3">
        {post.text}{" "}
      </p>
    </div>
  );
};

export default LinkedinCard;