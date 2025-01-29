"use client";

import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import React from "react";

const Page = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default Page;
