"use client";
import { useUserStore } from "@/store/userStore";
import { CustomLoader } from "@components/global/CustomLoader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { user, fetchUser } = useUserStore(); // Add fetchUser from the store
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (user === null && token) {
      // Fetch user if not loaded and token exists
      fetchUser(token).then(() => {
        setLoading(false); // Resolve loading after fetch completes
      });
    } else if (user === null && !token) {
      // No token, assume logged out, stop loading
      setLoading(false);
    } else if (user && !user?.onboarding) {
      // User exists but needs onboarding
      router.replace("/onboarding");
      setLoading(false);
    } else {
      // User exists and onboarding is done
      setLoading(false);
    }
  }, [user, router, fetchUser]); // Add fetchUser to dependencies

  if (loading || user === null) {
    return <CustomLoader />;
  }

  return (
    <main className="flex-1 flex flex-col space-y-3 items-center justify-center h-screen overflow-y-auto">
      <Image
        src={"/coming-soon.avif"}
        alt="no image"
        className="object-fill h-64 w-64"
        height={400}
        width={400}
      />
      <h2 className="text-2xl text-white ">Coming Soon...</h2>
    </main>
  );
};

export default Page;