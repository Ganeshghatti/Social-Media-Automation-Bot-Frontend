import React from "react";

const FeatureCard = ({ title, description, reverse }) => {
  return (
    <div className="flex flex-col md:flex-row text-center items-center justify-center py-48 h-full gap-10 px-10">
      <div
        className={`flex-1 flex flex-col gap-7 ${reverse ? "md:order-2" : ""}`}
      >
        <h3 className="text-[##383838] font-semibold text-4xl">{title}</h3>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
      <div className="flex-1 border-2 py-16 h-96"></div>
    </div>
  );
};

export default FeatureCard;
