"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const WorkspacePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      setTimeout(() => {
        router.push("/dashboard");
      }, 5000);
    }
  }, [success, router]);

  return (
    <div className="h-screen flex items-center justify-center ">
      {success === "true" ? (
        <div className="flex items-center justify-center flex-col gap-5">
          <h1 className="text-7xl font-bold">Connection Completed!</h1>
          <p className="text-2xl text-muted-foreground">
            Twitter account connected successfully. Enjoy your twitter posting
            with breeze
          </p>
          <p className="text-lg text-blue-600 font-medium">
            Redirecting to your page in a while !
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col gap-5">
          <h1 className="text-7xl font-bold">Connection failed</h1>
          <p className="text-2xl text-muted-foreground">
            Twitter account was not able to connect properly please try once
            again.
          </p>
          <p className="text-lg text-blue-600 font-medium">
            Redirecting to your page in a while !
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
