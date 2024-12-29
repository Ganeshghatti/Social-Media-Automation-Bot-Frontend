import React from "react";
import Image from "next/image";
import listImg from "../../../public/listlogo.png";
import { ArrowUp } from "lucide-react";

const ListCard = ({label, value, percent} : { label: string; value: number; percent: number }) => {
  return (
    <div className="bg-lightSecondary dark:bg-darkSecondary rounded-xl px-6 py-5 shadow-sm">
      <div className="flex items-start gap-4">
      <div className="w-[54.31px] aspect-square rounded-full bg-[#BAD4F3] flex justify-center items-center overflow-hidden">
        <Image
          src={listImg}
          width={70}
          height={70}
          className="w-[30px] aspect-square object-cover"
          alt="list logo"
        />
      </div>
      <div>
        <p className="text-4xl font-bold">{value}</p>
        <p className="text-sm mt-1 ">{label}</p>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <div className="w-7 aspect-square rounded-full bg-lightAccent/10 flex justify-center items-center">
            <ArrowUp className="text-[5px] text-lightAccent" />
          </div>

          <p>{percent}% (30 days)</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ListCard;
