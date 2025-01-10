import FeatureCard from "@/components/global/feature-card";
import { featureData } from "@/constants";
import React from "react";

const Features = () => {
  return (
    <div className="py-24 bg-[#F4F8FE] px-6 md:px-14 flex flex-col gap-6">
      <h3 className="text-4xl text-[#383838] font-bold">
        Explore advanced Features
      </h3>
      <p className="text-muted-foreground text-lg">
        Effortlessly enhance your app with powerful AI-driven capabilities.
      </p>
      {featureData.map((item, index) => (
        <FeatureCard
          key={index}
          title={item.title}
          description={item.description}
          reverse={item.isReverse}
        />
      ))}
    </div>
  );
};

export default Features;
