"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <main className="flex-1 flex flex-col h-screen bg-navBg items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">
        404 - Workspace Not Found
      </h1>
      <p className="text-lg text-gray-600">
        The workspace you are looking for does not exist.
      </p>
      <Button
        onClick={() => router.push("/workspace")}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go Back to Workspaces
      </Button>
    </main>
  );
};

export default NotFoundPage;
