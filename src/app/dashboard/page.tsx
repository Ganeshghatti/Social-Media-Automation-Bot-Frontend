"use client";
import React from "react";
import ThemeChange from "@/components/global/theme-change";
import ListCard from "@/components/global/list-card";
import InstagramCard from "@/components/instagram/instagram-card";
import { CountChat } from "@/components/chat/count-chat";
import { ReachChat } from "@/components/chat/reach-chat";

const page = () => {
  return (
    <main className="p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Hi, Adarsh. Welcome back to us!
        </p>
        <ThemeChange />
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div className="col-span-2">
            <CountChat />
          </div>
          <ReachChat />
        </div>
        <div className="grid mt-5 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <InstagramCard key={i} />
          ))}
        </div>
  
      </div>
    </main>
  );
};

export default page;
