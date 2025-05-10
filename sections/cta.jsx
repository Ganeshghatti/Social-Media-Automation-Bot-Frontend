import React from "react";
import { Button } from "@components/ui/button";

const CTA = () => {
  return (
    <div className="background-image  flex items-center justify-center flex-col py-32 px-5 gap-8">
      <h3 className="text-white font-bold text-3xl md:text-5xl text-center">
        Join our mission. Copilot the future.
      </h3>
      <p className="text-white/70 text-lg text-center">
        Effortlessly enhance your app with powerful AI-driven capabilities.
      </p>
      <div className="flex gap-5">
        <Button className="border-2 border-white px-10 bg-white text-[#0C1E5B]  py-5 rounded-md hover:bg-[#0C1E5B] hover:text-white">
          Talk to Us
        </Button>
        <Button className="border-2 border-white px-10 bg-[#0C1E5B]  text-white  py-5 rounded-md hover:bg-white hover:text-[#0C1E5B]">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default CTA;
