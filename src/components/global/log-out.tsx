'use client';
import React from "react";
import { Button } from "../ui/button";

const Logout = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Button
      variant={"outline"}
      className="rounded-full text-red-600 border-red-900 hover:bg-red-700 transition-all"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default Logout;
