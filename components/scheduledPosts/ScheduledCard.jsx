import React from "react";
import { Badge } from "@components/ui/badge";
import { format } from "date-fns";

export const ScheduledCard = ({ post }) => {
  const formattedDate = format(new Date(post?.tobePublishedAt), "PPP p");

  return (
    <div className="flex flex-col py-4 px-3 rounded-xl space-y-4 bg-navBg border border-gray-700 shadow-lg">
      {/* Post Content */}
      <h4 className="text-lg text-white font-semibold">{post?.content}</h4>

      <div className="flex items-center justify-between space-x-2">
        <Badge className="bg-primary hover:bg-primary/80 text-white flex justify-center items-center cursor-pointer capitalize">
          {post?.platform}
        </Badge>

        <Badge
          className={`${
            post?.isPublished
              ? "bg-green-500 hover:bg-green-600"
              : "bg-yellow-500 hover:bg-yellow-600"
          } text-white flex justify-center items-center cursor-pointer`}
        >
          {post?.isPublished ? "Published" : "Scheduled"}
        </Badge>

        <Badge
          className={`bg-purple-600 hover:bg-purple-700 text-white flex justify-center items-center cursor-pointer capitalize`}
        >
          {post?.type}
        </Badge>
      </div>

      {/* Scheduled Time */}
      <div className="text-sm text-gray-300">
        Scheduled at: {formattedDate} ({post?.timezone})
      </div>

      {/* Media Preview */}
      {post?.media?.length > 0 && (
        <div className="mt-2">
          <img
            src={post.media[0]}
            alt="Post media"
            className="w-full h-40 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};
