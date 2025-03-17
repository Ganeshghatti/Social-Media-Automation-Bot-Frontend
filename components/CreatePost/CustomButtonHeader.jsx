import { Button } from "@components/ui/button";
import React from "react";

const CustomButtonHeader = ({
  buttonText,
  buttonColor,
  actionButton,
  activeButtons,
}) => {
  return (
    <Button
      onClick={actionButton && actionButton}
      style={{ backgroundColor: activeButtons ? buttonColor : "gray" }}
      className="px-6 rounded-full py-3 flex justify-center items-center"
    >
      <span className="text-sm md:text-base font-medium text-white">{buttonText}</span>
    </Button>
  );
};

export default CustomButtonHeader;
