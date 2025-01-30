"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const WorkspacePage = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const { success } = router.query;

    // Delay access to query parameters to ensure it runs in the browser
    if (success) {
      setSuccess(success);
      if (success === "true") {
        setTimeout(() => {
          router.push("/dashboard");
        }, 5000);
      }
    }
  }, [router.query]);

  if (success === null) {
    return <div>Loading...</div>; // Handle loading state if needed
  }

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
