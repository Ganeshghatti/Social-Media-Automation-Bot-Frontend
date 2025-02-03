import React from "react";

const WorkspaceLayout = ({children}) => {
  return <div className="h-screen flex items-center justify-center ">
    {children}
  </div>;
};

export default WorkspaceLayout;
