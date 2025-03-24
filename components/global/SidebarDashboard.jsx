"use client";
import React from "react";
import { Sidebar_Card } from "../single-workspace/Sidebar_Card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarContent, SidebarHeader } from "@components/ui/sidebar";

const SidebarDashboard = () => {
  const router = useRouter();

  return (
    <Sidebar className=" px-4 py-6 bg-darkBg  flex flex-row ">
      <SidebarHeader className="flex  bg-darkBg  flex-col gap-14 items-center w-full">
        <div className="flex w-full items-center gap-4">
          <Image
            src={"/sidebar_logo.png"}
            height={61}
            alt="Image"
            width={52}
            className="object-contain"
          />
          <div className="flex flex-col items-start text-white">
            <h1 className=" font-bold text-2xl">The</h1>
            <h1 className=" font-bold text-2xl">Squirrel</h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className=" bg-darkBg">
        <div className="flex flex-col w-full gap-3">
          <Sidebar_Card
            imageUrl={"/dashboard_icon.png"}
            text={"Dashboard"}
            onClickFunction={() => {
              router.push("dashboard");
            }}
          />
          <Sidebar_Card
            imageUrl={"/Analytics.png"}
            text={"Analytics"}
            onClickFunction={() => {
              router.push("analytics");
            }}
          />
          <div className="w-full h-[1px] bg-white opacity-40" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarDashboard;
