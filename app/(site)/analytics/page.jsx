"use client";
import { useUserStore } from "@/store/userStore";
import { CustomLoader } from "@components/global/CustomLoader";
import useAuthToken from "@hooks/useAuthToken";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { user, fetchUser } = useUserStore(); // Add fetchUser from the store
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const token=useAuthToken()

  useEffect(() => {
    if (user === null && token) {
      fetchUser(token).then(() => {
        setLoading(false); // Resolve loading after fetch completes
      });
    } else if (user === null && !token) {
      setLoading(false);
    } else if (user && !user?.onboarding) {
      router.replace("/onboarding");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, router, fetchUser,token]); 

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