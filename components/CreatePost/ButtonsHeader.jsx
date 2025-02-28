import React from "react";
import CustomButtonHeader from "./CustomButtonHeader";

export const ButtonsHeader = ({
  onPublish,
  activeButtons,
  createDraftPosts,
}) => {
  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-end  ">
      <CustomButtonHeader
        buttonColor={"#FF9900"}
        activeButtons={activeButtons}
        actionButton={createDraftPosts}
        buttonText={"Save as Draft"}
      />
      <CustomButtonHeader
        activeButtons={activeButtons}
        buttonColor={"#079500"}
        actionButton={onPublish}
        buttonText={"Schedule"}
      />
      <CustomButtonHeader
        buttonColor={"#1E58E8"}
        buttonText={"Publish"}
        activeButtons={activeButtons}
      />
    </div>
  );
};
