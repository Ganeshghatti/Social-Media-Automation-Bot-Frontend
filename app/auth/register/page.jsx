"use client";

import { RegisterForm } from "@/components/register-form";
import React from "react";
import dynamic from "next/dynamic";

const Page = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

// Use dynamic import with ssr disabled for the auth wrapper
export default dynamic(() => Promise.resolve(withAuth(Page)), {
  ssr: false
});
