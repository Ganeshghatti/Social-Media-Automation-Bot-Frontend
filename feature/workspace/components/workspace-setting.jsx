import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import Image from "next/image";

const WorkspaceSettings = ({ isOpen, setIsOpen, workSpaceData }) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            {/* <Image
                        src={workSpaceData?.icon}
                        alt="workspace"
                        width={100}
                        height={100}
                    /> */}
            <DialogTitle className="capitalize text-lg">
              Workspace : {workSpaceData?.name}
            </DialogTitle>
            <DialogDescription>{workSpaceData?.about}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold">Keywords :</h3>
            <div className="flex gap-5 bg-gray-200 rounded-lg px-3 py-4">
              {workSpaceData?.settings?.keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="bg-gray-500 px-6 py-2 border-2 border-gray-600 rounded-lg"
                >
                  <p className="text-xs font-medium text-white ">{keyword}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold">Connected Accounts :</h3>
            <div className="flex gap-5 bg-gray-200 rounded-lg px-3 py-4">
              {workSpaceData?.connectedAccounts?.length > 0 ? (
                <div className="flex gap-5 py-3">
                  {workSpaceData.connectedAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="px-6 py-2 border-2 border-gray-600 rounded-lg"
                    >
                      <p className="text-xs font-medium">{account}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No connected accounts
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Created At :{" "}
            <span>
              {new Date(workSpaceData?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspaceSettings;
