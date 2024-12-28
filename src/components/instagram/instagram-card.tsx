import React from "react";
import { Instagram } from "lucide-react";

const InstagramCard = () => {
  return (
    <div className="rounded-xl shadow-sm bg-lightSecondary dark:bg-darkSecondary p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold">@Ganeshtx</p>
        <Instagram className="text-pink-400" />
      </div>
      <div className="mt-2 flex gap-3 items-center">
        <p className="text-black/70 dark:text-[#A3A3A3]">24 m ago</p>
        <div className="flex gap-1 items-center">
          <span className="w-2 h-2 aspect-square rounded-full inline-block mr-1 bg-black/30 dark:bg-[#A3A3A3]"></span>
          <span className="text-green-700">Success</span>
        </div>
      </div>

      <p className="mt-3 text-black/70 dark:text-[#A3A3A3]">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text{" "}
      </p>
    </div>
  );
};

export default InstagramCard;