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

export const CreatePostHeader = () => {
  const { logout, user } = useUserStore();
  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-end bg-[#1A1D1F] z-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="px-6 bg-primary rounded-full py-3 flex justify-center items-center">
            <span className="text-base font-medium text-white">
              <Image
                height={32}
                width={32}
                alt="diamond"
                className="h-8 w-8 object-contain"
                src={"/diamond-button-bg.png"}
              />
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80%]  bg-headerBg  border-transparent gap-2 px-4 py-5 justify-center items-center flex flex-col space-y-6">
          <DialogHeader className="flex justify-start items-center flex-col space-y-1">
            <DialogTitle className="text-white text-3xl ">
              Upgrade to Premium
            </DialogTitle>
            <Image
              className="w-32 h-32 object-contain"
              height={300}
              width={300}
              src={"/two-diamonds.png"}
              alt="Diamond Image"
            />
          </DialogHeader>
          <DialogDescription className="flex flex-col space-y-5 items-center justify-center">
            <Button className=" px-5 py-2 rounded-full w-[200px]">
              <p className="text-xl my-4 text-white">Buy</p>
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Link href={"/profile"}>
        <Image
          alt="Profile"
          src={
            user && user?.profilePicture
              ? user?.profilePicture
              : "/default-profile.jpg"
          }
          height={48}
          width={48}
          className="object-cover rounded-full cursor-pointer"
        />
      </Link>
    </div>
  );
};
