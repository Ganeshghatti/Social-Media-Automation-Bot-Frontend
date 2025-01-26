"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const WorkspacePage = () => {
  const router = useRouter();
  const { success } = router.query;

  useEffect(() => {
    if (success === "true") {
      setTimeout(() => {
        router.push("/dashboard");
      }, 5000);
    }
  }, [success, router]);

  return (
    <div>
      {success === "true" ? (
        <h1>Twitter account connected successfully</h1>
      ) : (
        <h1>Connection failed</h1>
      )}
    </div>
  );
};

export default WorkspacePage;
