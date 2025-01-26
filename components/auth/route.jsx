"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
