"use client";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UpgradePremiumDialog } from "../global/UpgradePremiumDialog";

export const CreatePostHeader = () => {
  const { user } = useUserStore();

  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-end bg-[#1A1D1F] sticky top-0 z-10">
      <UpgradePremiumDialog />

      <Link href={"/profile"}>
        <Image
          alt="Profile"
          src={user?.profilePicture || "/Default_pic.jpg"}
          height={43}
          width={43}
          className="object-cover rounded-full cursor-pointer"
        />
      </Link>
    </div>
  );
};
