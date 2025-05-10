"use client";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import React, { useEffect } from "react";
import { UpgradePremiumDialog } from "../global/UpgradePremiumDialog";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import useAuthToken from "@hooks/useAuthToken";

export const CreatePostHeader = () => {
  const { user, fetchUser } = useUserStore();
  const token = useAuthToken();


  useEffect(() => {
    if (token) fetchUser(token);
  }, [token, fetchUser]);


  return (
    <div className="w-full px-4 md:px-8 py-3 gap-3 flex justify-end items-center bg-[#1A1D1F] sticky top-0 z-10 overflow-x-hidden" style={{ boxSizing: 'border-box' }}>
      <UpgradePremiumDialog />
        
      <Link href={"/profile"}>
        <Avatar className="h-10 w-10 flex items-center justify-center ">
          <AvatarFallback className="flex items-center justify-center h-full w-full text-xl text-black">
            {user && user?.username[0]}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
};