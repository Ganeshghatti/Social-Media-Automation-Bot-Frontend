"use client";
import React, { useEffect } from "react";
import { getUser } from "@/services/auth-service";
import { useRouter } from "next/navigation";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const token = getUser();
    if (!token) {
      router.push("/");
    }
  }, []);

  return <main>{children}</main>;
};

export default AuthProvider;
