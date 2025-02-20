import React from "react";
import CustomButtonHeader from "./CustomButtonHeader";

export const ButtonsHeader = ({ onPublish }) => {
  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-end  ">
      <CustomButtonHeader
        buttonColor={"#FF9900"}
        buttonText={"Save as Draft"}
      />
      <CustomButtonHeader buttonColor={"#079500"} buttonText={"Schedule"} />
      <CustomButtonHeader
        onPublish={onPublish}
        buttonColor={"#1E58E8"}
        buttonText={"Publish"}
      />
    </div>
  );
};
