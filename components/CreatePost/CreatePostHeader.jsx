import Image from "next/image";
import React from "react";

export const CreatePostHeader = () => {
  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-end bg-[#1A1D1F] sticky top-0 z-10">
      <div className="flex items-center p-2 h-11 w-11 rounded-full cursor-pointer bg-[#111315] justify-center">
        <Image
          alt="Setting "
          src={"/settings.png"}
          height={22}
          width={22}
          className="object-contain h-full w-full"
        />
      </div>
      <div className="flex items-center p-2 h-11 w-11 rounded-full cursor-pointer bg-[#111315] justify-center">
        <Image
          alt="Notification"
          src={"/Notification.png"}
          height={22}
          width={22}
          className="object-contain h-full w-full"
        />
      </div>
      <Image
        alt="Profile"
        src={"/profile.png"}
        height={48}
        width={48}
        className="object-contain"
      />
    </div>
  );
};

