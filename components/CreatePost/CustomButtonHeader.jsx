import { Button } from "@components/ui/button";
import React from "react";

const CustomButtonHeader = ({
  buttonText,
  buttonColor,
  onPublish,
  activeButtons,
}) => {
  return (
    <Button
      onClick={onPublish && onPublish}
      style={{ backgroundColor: activeButtons ? buttonColor : "gray" }}
      className="px-6 rounded-full py-3 flex justify-center items-center"
    >
      <span className="text-base font-medium text-white">{buttonText}</span>
    </Button>
  );
};

export default CustomButtonHeader;
