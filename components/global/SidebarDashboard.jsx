"use client";
import React from "react";
import { Sidebar_Card } from "../single-workspace/Sidebar_Card";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SidebarDashboard = () => {
  const router = useRouter();

  return (
    <div className=" md:flex hidden flex-col items-start justify-between w-56 bg-darkBg px-4 py-6 shadow-sm text-white no-scrollbar h-screen overflow-y-auto sticky top-0">
      <div className="flex flex-col gap-14 items-center w-full">
        <div className="flex w-full items-center gap-4">
          <Image
            src={"/sidebar_logo.png"}
            height={61}
            alt="Image"
            width={52}
            className="object-contain"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-white font-bold text-2xl">The</h1>
            <h1 className="text-white font-bold text-2xl">Squirrel</h1>
          </div>
        </div>
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
          <Sidebar_Card
            imageUrl={"/dashboard_icon.png"}
            text={"Workspaces"}
            onClickFunction={() => {
              router.push("workspaces");
            }}
          />
          <div className="w-full h-[1px] mt- bg-white opacity-40" />
        </div>
      </div>
    </div>
  );
};

export default SidebarDashboard;
