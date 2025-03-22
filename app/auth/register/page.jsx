"use client";

import { RegisterForm } from "@components/register-form";
import useAuthToken from "@hooks/useAuthToken";
import { BotIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const token = useAuthToken();
  const router = useRouter();
  if (token) {
    router.push("/dashboard");
  }
  return (
    <div className="grid min-h-svh bg-navBg lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="#"
            className="flex items-center gap-2 font-medium text-white"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Image
                src={"/logo.jpg"}
                width={24}
                height={24}
                alt="squirrel logo"
              />
            </div>
            Squirrel Bot.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          layout="fill"
          src="/placeholder.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Page;
