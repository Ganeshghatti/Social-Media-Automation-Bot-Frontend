"use client";

import { RegisterForm } from "@components/register-form";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen overflow-y-auto w-screen overflow-x-hidden bg-navBg flex md:flex-row flex-col md:items-start md:justify-start justify-center items-center p-2">
      <div className="md:flex hidden relative flex-[0.3] p-0    h-full  ">
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
