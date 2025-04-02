"use client";
import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import Image from "next/image";
import { CustomTextarea } from "../global/CustomTextarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";
import { Search, Sparkles, Trash, Upload } from "lucide-react";

export const CreatePostCard = ({
  value,
  onChange,
  setCards,
  textareaRef,
  setNewCardAdded,
  cards,
  setPostType,
  cardId,
  width,
}) => {
  const { user, setUser } = useUserStore();
  return (
    <Card
      className={`w-full sm:w-full 
        flex flex-row gap-4 bg-transparent h-full max-h-[240px] 
        border-transparent mx-auto 
        ${!width?"md:w-[60vw] lg:w-[70vw] xl:w-[55vw] min-w-[240px] max-w-[1440px] ":"w-full"}
        `}
    >
      <CardTitle className="p-0 justify-between   flex gap-4 h-full items-center">
        <div className="flex gap-4 items-center justify-center  h-full ">
          <div className="relative h-full  ">
            <Image
              alt="Profile"
              src={
                user && user?.profilePicture
                  ? user?.profilePicture
                  : "/logo.jpg"
              }
              height={40}
              width={40}
              className="rounded-full object-cover"
            />
            <div className="bg-[#FFFFFF33] absolute left-1/2 h-[90%] w-[1px]" />
          </div>
        </div>
      </CardTitle>
      <div className="flex h-full w-full  flex-col gap-4   justify-between">
        <div className="flex flex-1 w-full items-center justify-between ">
          <h2 className="font-medium text-lg text-white">{user?.username}</h2>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 hover:bg-headerBg rounded-sm cursor-pointer flex justify-center items-center">
                <Image
                  src="/ThreeDots.svg"
                  alt="More"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg p-0 min-w-[140px] flex flex-col gap-2 bg-headerBg border-[0.5px] border-transparent">
              <div
                onClick={() => {
                  setCards(cards.filter((card) => card.id !== cardId));
                  if (cards.length <= 1) setPostType("post");
                }}
                className="flex gap-3  bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-4 justify-between py-3 items-center cursor-pointer"
              >
                <span className="text-white text-xs">Delete</span>
                <Trash className="object-contain h-4 w-4 text-red-600" />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent className="w-full p-0 justify-start items-start flex  ">
          <CustomTextarea value={value} onChange={onChange} ref={textareaRef} />
        </CardContent>

        <CardFooter className="flex  w-full gap-3 px-2 py-3 pt-1 justify-end items-center">
          <div
            onClick={() => {
              setCards((prev) => [...prev, { id: prev.length, text: "" }]);
              setNewCardAdded(true);
            }}
            className="w-8 h-8 rounded-sm flex hover:bg-headerBg  justify-center items-center cursor-pointer"
          >
            <Image
              src={"/AddSquirrel.svg"}
              alt="AddSquirrel "
              height={20}
              width={20}
              className="object-contain h-4 w-4"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 flex  rounded-sm  hover:bg-headerBg justify-center items-center cursor-pointer">
                <Image
                  src={"/SquireelGallery.svg"}
                  alt="SquireelGallery"
                  height={200}
                  width={200}
                  className="object-contain h-5 w-5"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg px-2 py-2 min-w-[140px] flex flex-col gap-2 bg-headerBg border-[0.5px] border-[#ffffff32]">
              <div className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer">
                <span className="text-white text-sm">User Upload</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Upload className="object-contain h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer">
                <span className="text-white text-sm">Ai Generated</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Sparkles className="object-contain text-purple-900 h-5 w-5" />
                </div>
              </div>
              <div className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer">
                <span className="text-white text-sm">Google Search</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Search className="object-contain h-5 w-5 text-white" />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </div>
    </Card>
  );
};
