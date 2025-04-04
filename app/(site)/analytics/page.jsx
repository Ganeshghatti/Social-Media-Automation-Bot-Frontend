"use client";
import { useUserStore } from "@/store/userStore";
import { CustomLoader } from "@components/global/CustomLoader";
import useAuthToken from "@hooks/useAuthToken";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <CustomLoader />;
  }
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6">
      <Image
        src="/UnderConstructionImage.png"
        alt="Under Construction"
        className="object-contain"
        height={600}
        width={600}
      />
      <div className="flex flex-col space-y-3 items-center justify-center ">
        <h2 className="text-3xl font-semibold text-white">
          Analytics Coming Soon
        </h2>
        <p className="text-sm text-gray-300 text-center max-w-md">
          We’re building something awesome! This analytics is currently under
          construction and will be available soon with powerful insights and
          features tailored just for you.
        </p>
      </div>
    </div>
  );
};

export default Page;
