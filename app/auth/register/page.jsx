"use client";

import { RegisterForm } from "@components/register-form";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="h-screen w-screen overflow-x-hidden bg-navBg flex items-start justify-start p-2 ">
        <div className="flex relative flex-[0.3] p-0    h-full  ">
        <Image
          src={"/AuthScreen.png"}
          height={3000}
          alt="No"
          width={3000}
          className="h-full w-full object-contain p-0 "
        />
        <Image
          src={"/DEALFLOW.png"}
          height={2000}
          width={2000}
          alt="No"
          className="h-full w-full object-fill absolute left-0 top-0 "
        />
      </div>
      <RegisterForm />
    
    </div>
  );
};

export default Page;
