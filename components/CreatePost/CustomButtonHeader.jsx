import { Button } from "@components/ui/button";
import React from "react";

const CustomButtonHeader = ({ buttonText, buttonColor, onPublish }) => {
  return (
    <Button
      onClick={onPublish && onPublish}
      style={{ backgroundColor: buttonColor }}
      className="px-6 rounded-full py-3 flex justify-center items-center"
    >
      <span className="text-base font-medium text-white">{buttonText}</span>
    </Button>
  );
};

export default CustomButtonHeader;
