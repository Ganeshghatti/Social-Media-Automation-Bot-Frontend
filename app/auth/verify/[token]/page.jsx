"use client";

import React from "react";
import { useState, useEffect } from "react";
import { handleApiError } from "@lib/ErrorResponse";
import axios from "axios";

const Page = ({ params }) => {
  const resolvedParams = React.use(params);
  const { token } = resolvedParams;

  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `https://api.bot.thesquirrel.tech/user/verification/${token}`
        );

        if (response.data.success) {
          setMessage("Email verified successfully!");
          setDescription(
            "You can now close this window and login to your account"
          );
        } else {
          throw new Error(
            response.data.error?.message || "Verification failed"
          );
        }
      } catch (error) {
        const errorMessage = handleApiError(
          error,
          "Verification failed. Please try again."
        );
        setMessage(errorMessage);
        setDescription("Please try again later or contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="h-screen w-screen flex justify-center bg-navBg items-center flex-col gap-10">
      {" "}
      <h1 className="text-5xl text-white font-bold">{message}</h1>
      <p className="text-white text-lg">{description}</p>
    </div>
  );
};

export default Page;
