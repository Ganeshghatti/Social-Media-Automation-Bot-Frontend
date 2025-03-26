"use client";
import { CustomLoader } from "@/components/global/CustomLoader";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return
    }
    if (!user?.onboarding) {
      router.replace("/onboarding");
    }else{
      setLoading(false)
    }
  }, [user, router]);


  // if (loading) {
  //   return <CustomLoader />;
  // }

  return (
    <main className="flex-1 flex flex-col space-y-3  items-center justify-center h-screen overflow-y-auto">
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
