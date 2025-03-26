import React from "react";
import { ClockLoader } from "react-spinners";

export const CustomLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navBg">
      <ClockLoader color="#FF6600" />
    </div>
  );
};

