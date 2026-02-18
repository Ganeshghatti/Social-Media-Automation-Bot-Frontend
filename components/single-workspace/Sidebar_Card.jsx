import Image from "next/image";
import React from "react";

export const Sidebar_Card = ({ text, imageUrl, onClickFunction, icon: Icon }) => {
  return (
    <div
      onClick={() => {
        if (onClickFunction) {
          onClickFunction();
        }
      }}
      className="py-6 rounded-2xl w-full cursor-pointer px-5 flex items-center justify-start gap-3 bg-navBg "
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Dashboard Image"
          height={24}
          width={24}
          className="object-contain"
        />
      )}

      {Icon && (
        <Icon className="object-contain text-primary h-6 w-6" />
      )}

      <span className="font-semibold text-base text-white">{text}</span>
    </div>
  );
};
