import React from "react";
import { Sidebar_Card } from "../single-workspace/Sidebar_Card";
import { Button } from "@components/ui/button";
import { disconnectLinkedIn, disconnectTwitter } from "@functions/social";

export const DialogSidebar = ({ workspaceData, isSubmitting, onSubmit }) => {
  return (
    <div className="flex flex-col items-start justify-between bg-headerBg py-3 
    shadow-sm text-white h-full min-h-full gap-4 flex-1 lg:w-[250px]">
      <div className="flex flex-col h-full justify-between items-center w-full
       px-2 gap-3 space-y-8">
        <div className="w-full space-y-3">
          {workspaceData?.connectedAccounts?.length > 0 ? (
            workspaceData.connectedAccounts.map((account, i) => (
              <Sidebar_Card
                key={i}
                onClickFunction={() =>
                  account?.type === "twitter"
                    ? disconnectTwitter(workspaceData.id, account?.userId)
                    : disconnectLinkedIn(workspaceData.id, account?.userId)
                }
                imageUrl={
                  account?.type === "twitter" ? "/twitter.png" : "/linkedIn.png"
                }
                text={account?.username}
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm">No connected accounts</p>
          )}
        </div>

        <Button
          type="button" // Change to button to manually trigger onSubmit
          onClick={onSubmit} // Trigger form submission
          disabled={isSubmitting}
          className="w-full mt-auto"
        >
          {isSubmitting ? "Scheduling..." : "Schedule Post"}
        </Button>
      </div>
    </div>
  );
};
