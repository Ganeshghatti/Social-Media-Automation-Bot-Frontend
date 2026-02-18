import React from "react";
import { Button } from "@components/ui/button";

const CTA = () => {
  return (
    <div className="background-image flex items-center justify-center flex-col py-32 px-5 gap-8">
      <h3 className="text-white font-bold text-3xl md:text-5xl text-center">
        Join our mission. Copilot the future.
      </h3>
      <p className="text-white/70 text-lg text-center">
        Effortlessly enhance your app with powerful AI-driven capabilities.
      </p>
      <div className="flex gap-5">
        <Button className="border-2 border-white px-10 bg-white text-[#e05a00]  py-5 rounded-md hover:bg-[#e05a00] hover:text-white">
          Talk to Us
        </Button>
        <Button className="border-2 border-white px-10 bg-[#e05a00]  text-white  py-5 rounded-md hover:bg-white hover:text-[#e05a00]">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default CTA;
