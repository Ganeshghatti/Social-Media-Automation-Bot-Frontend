"use client";
import React, { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import useAuthToken from "@/hooks/useAuthToken";

const LayoutOnboadingPage = ({ children }) => {
    const { fetchUser } = useUserStore();
    const token = useAuthToken(); // Get token here

    useEffect(() => {
      if (token) {
        fetchUser(token); // Pass token as parameter
      }
    }, [token]); // Run effect when token is available

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
          {children}
        </div>
    );
};

export default LayoutOnboadingPage;
