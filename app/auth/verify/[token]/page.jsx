"use client";

import React from "react";
import { useState, useEffect } from "react";

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
          `https://api.bot.thesquirrel.site/user/verification/${token}`
        );
        setMessage("Email verified successfully!");
        setDescription(
          "You can now close this window and login to your account"
        );
        console.log(response.data);
      } catch (error) {
        setMessage("Verification failed. Please try again.");
        setDescription("Please try again later or contact support");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col gap-10">
      {" "}
      <h1 className="text-5xl font-bold">{message}</h1>
      <p className="text-muted-foregorund text-lg">{description}</p>
    </div>
  );
};

export default Page;
