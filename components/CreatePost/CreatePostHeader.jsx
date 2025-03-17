import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Diamond, LucideDiamond } from "lucide-react";
import Image from "next/image";
import React from "react";

export const CreatePostHeader = () => {
  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-end bg-[#1A1D1F] sticky top-0 z-10">
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
        <DialogContent className="w-[40vw] max-w-[40vw] h-[420px]  bg-headerBg  border-transparent gap-2 px-4 py-5 justify-center items-center flex flex-col space-y-6">
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
