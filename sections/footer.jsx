import React from "react";
import Image from "next/image";
import { socialData } from "@constants/index.js";

const Footer = () => {
  return (
    <div className="bg-[#222]  py-10">
      <div className="py-16 px-10 flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div className="py-10">
          <Image
            src={"/logo-dark.svg"}
            alt="dark squirrel pilot logo"
            height={200}
            width={200}
            className="mx-auto md:mx-0"
          />
          <p className="text-white font-md pt-4">
            Creating intelligent digital experiences.
          </p>
        </div>
        <div className="flex gap-5 flex-col justify-center items-center">
          <div className="flex gap-4">
            {socialData.map((item, index) => (
              <Image
                key={index}
                width={22}
                height={22}
                alt={item.alt}
                src={item.logo}
                className="cursor-pointer"
              />
            ))}
          </div>
          <p className="text-white underline">info@thesquirrel.tech</p>
          <p className="text-white font-normal">+91 94496 10077</p>
        </div>
      </div>
      <hr className="mx-8 pb-4 text-white/10" />
      <p className="px-10 text-muted-foreground text-sm">
        © Squirrel. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
