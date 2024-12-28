import PostTable from "@/components/twitter/post-table";

export default function Page() {
  return (
    <main className="p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Upload Twitter Post by Automation
          </h1>
          {/* <ThemeChange /> */}
        </div>
      </div>
      <div className="mt-6">
        <PostTable />
      </div>
    </main>
  );
}
