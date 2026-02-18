import React from "react";

import { Button } from "@components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="flex items-center justify-center flex-col py-36 gap-10">
      <h1 className="text-4xl md:text-7xl text-center text-black font-bold">
        Experience Digital automation <br /> like never before
      </h1>
      <p className="text-muted-foreground text-center text-xl">
        Brace yourself for an extraordinary journey into the future of
        technology.
      </p>
      <div className="flex gap-5">
        <Button className="border-2 border-[#e05a00]  px-10 bg-white text-[#e05a00]  py-5 rounded-md hover:bg-[#e05a00] hover:text-white">
          Talk to Us
        </Button>
        <Link href={"/auth/login"}>
          <Button className="border-2 border-[#e05a00] px-10 bg-[#e05a00]  text-white  py-5 rounded-md hover:bg-white hover:text-[#e05a00]">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
