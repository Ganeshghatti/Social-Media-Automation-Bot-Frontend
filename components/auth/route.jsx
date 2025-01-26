"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Check for token in localStorage
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      } else {
        setIsAuthenticated(false);
      }
    }, [router]);

    if (!isAuthenticated) {
      return null; // Show nothing while checking authentication
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
