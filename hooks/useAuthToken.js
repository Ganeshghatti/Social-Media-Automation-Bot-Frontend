"use client";

import { useState, useEffect } from "react";

const useAuthToken = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setLoading(false);
    }
  }, []);

  if (!loading && !token) {
    throw new Error("No token found!");
  }

  return token;
};

export default useAuthToken;
