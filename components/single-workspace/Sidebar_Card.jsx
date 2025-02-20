import Image from "next/image";
import React from "react";

export const Sidebar_Card = ({ text, imageUrl, onClickFunction }) => {
  return (
    <div
      onClick={() => {
        if (onClickFunction) {
          onClickFunction();
        }
      }}
      className="py-6 rounded-xl w-full  cursor-pointer px-3 flex items-center justify-start gap-3 bg-navBg "
    >
      <Image
        src={imageUrl}
        alt="Dashboard Image"
        height={24}
        width={24}
        className="object-contain"
      />
      <span className="font-semibold text-base text-white">{text}</span>
    </div>
  );
};
