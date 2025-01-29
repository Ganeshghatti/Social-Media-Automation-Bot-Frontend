"use client";

import { LoginForm } from "@/components/login-form";
import React from "react";

import withAuth from "@/components/auth/route";

const Page = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default withAuth(Page);
