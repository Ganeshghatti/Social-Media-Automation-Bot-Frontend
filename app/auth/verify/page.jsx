import React from "react";

const Page = () => {
  return (
    <div className="h-screen w-screen flex justify-center bg-navBg items-center flex-col gap-10">
      <h1 className="text-7xl text-white font-bold">Email Verification Sent</h1>
      <p className="text-lg text-white">
        An email with verification link inside it has been sent to your email.
        Please open your inbox and verify you email to login.
      </p>
    </div>
  );
};

export default Page;
