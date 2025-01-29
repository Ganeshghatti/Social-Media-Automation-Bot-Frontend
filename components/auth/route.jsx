"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    }, [router]);

    if (checkingAuth) {
      return <div className="h-screen flex items-center justify-center text-lg">Checking authentication...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
