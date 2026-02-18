import Image from "next/image";
import React from "react";

const Productivity = () => {
  return (
    <div className="background-image  flex items-center justify-center flex-col">
      <h2 className="text-white font-bold text-3xl md:text-5xl text-center py-16 md:py-36">
        Boost your Productivity
      </h2>
      <Image
        src={"/dashboard.png"}
        alt="squirrel dashboard image"
        width={1200}
        height={1200}
        className="rounded-lg pb-20 px-16"
      />
    </div>
  );
};

export default Productivity;
