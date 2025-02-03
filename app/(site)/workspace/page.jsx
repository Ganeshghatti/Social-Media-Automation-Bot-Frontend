"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const WorkspacePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const successParam = searchParams.get("success");

    if (successParam) {
      setSuccess(successParam);
      if (successParam === "true") {
        setTimeout(() => {
          router.push("/dashboard");
        }, 5000);
      }
    }
  }, [searchParams, router]);

  if (success === null) {
    return <div>Loading...</div>;
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

const WorkspacePage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <h1>Loading...</h1>
        </div>
      }
    >
      <WorkspacePageContent />
    </Suspense>
  );
};

export default WorkspacePage;
