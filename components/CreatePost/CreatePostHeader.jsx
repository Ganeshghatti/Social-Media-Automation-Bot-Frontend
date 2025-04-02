"use client";
import { useUserStore } from "@/store/userStore";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { DiamondPlus } from "lucide-react";

export const CreatePostHeader = () => {
  const { user } = useUserStore();
  console.log("user", user);
  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-end
     bg-[#1A1D1F] sticky top-0 z-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="px-8 bg-gradient-to-r from-yellow-400 via-yellow-500
           to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 border-2 border-yellow-600 rounded-full py-3 flex justify-center items-center shadow-lg transform transition-transform hover:scale-105">
            <span className="text-base font-semibold text-white">
              Join Premium
            </span>
            <DiamondPlus className="ml-2 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[60vw] max-w-[60vw] h-[500px] bg-headerBg border-transparent gap-2 px-4 py-5 justify-center items-center flex flex-col space-y-6">
          <DialogHeader className="flex justify-start items-center flex-col space-y-1">
            <DialogTitle className="text-white text-3xl ">
              Upgrade to Premium
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* <div className="flex items-center p-2 h-11 w-11 rounded-full cursor-pointer bg-[#111315] justify-center">
        <Image
          alt="Setting "
          src={"/settings.svg"}
          height={22}
          width={22}
          className="object-contain h-full w-full"
        />
      </div>
      <div className="flex items-center p-2 h-11 w-11 rounded-full cursor-pointer bg-[#111315] justify-center">
        <Image
          alt="Notification"
          src={"/Notification.svg"}
          height={22}
          width={22}
          className="object-contain h-full w-full"
        />
      </div> */}
      <Link href={"/profile"}>
        <Image
          alt="Profile"
          src={
            user && user?.profilePicture ? user?.profilePicture : "/logo.jpg"
          }
          height={43}
          width={43}
          className="object-cover rounded-full cursor-pointer"
        />
      </Link>
    </div>
  );
};
