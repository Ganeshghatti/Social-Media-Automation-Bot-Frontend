"use client";

import { LoginForm } from "@components/login-form";
import useAuthToken from "@hooks/useAuthToken";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const token=useAuthToken()
  const router=useRouter()
  if (token) {
    router.push('/dashboard')
  }
  return (
    <div className="min-h-screen w-full overflow-hidden bg-navBg flex flex-col-reverse
     md:flex-row items-center justify-center p-3 md:p-6 lg:p-10 space-x-2">
      <LoginForm />
      <div className="hidden xl:flex flex-1 relative h-[90vh] w-[60vw] max-w-md lg:max-w-lg xl:max-w-xl">
        <Image
          src="/AuthScreen.png"
          layout="fill"
          objectFit="contain"
          alt="Auth Screen"
          className="absolute"
        />
        <Image
          src="/DEALFLOW.png"
          layout="fill"
          objectFit="cover"
          alt="Dealflow"
          className="absolute left-0 top-0"
        />
      </div>
    </div>
  );
};

export default Page;
