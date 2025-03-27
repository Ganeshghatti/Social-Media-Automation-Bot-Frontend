import React from "react";
import { ClockLoader } from "react-spinners";

export const CustomLoader = () => {
  return (
    <div className="flex w-screen h-screen overflow-hidden items-center justify-center bg-navBg">
      <ClockLoader color="#FF6600" />
    </div>
  );
};

