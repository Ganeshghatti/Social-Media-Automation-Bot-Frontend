import { clients } from "@constants/index.js";
import Image from "next/image";
import React from "react";

const Clients = () => {
  return (
    <div className="py-24 md:px-14 bg-[#F4F6F8]">
      <h1 className="text-[#0C1E5B] text-center md:text-left text-3xl md:text-5xl font-bold leading-relaxed">
        Trusted by developers at <br />
        companies worldwide:
      </h1>
      <div className="flex flex-col md:flex-row gap-10 md:gap-0 items-center justify-around pt-24">
        {clients.map((client, index) => (
          <Image
            key={index}
            src={client.logo}
            alt={client.alt}
            height={180}
            width={180}
            className="grayscale"
          />
        ))}
      </div>
    </div>
  );
};

export default Clients;
