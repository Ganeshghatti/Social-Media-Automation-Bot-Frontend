import React from "react";
import LinkedinTable from "@/components/linkedin/linkedin-table";

const page = () => {
  return (
    <main className="p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Upload Linkedin Post by Automation
          </h1>
        </div>
      </div>
      <div className="mt-10">
        <LinkedinTable />
      </div>
    </main>
  );
};

export default page;
