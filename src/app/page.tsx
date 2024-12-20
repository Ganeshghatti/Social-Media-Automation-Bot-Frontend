import Image from "next/image";
import GeneratePost from "@/components/global/generate-post";
import TwitterCard from "@/components/global/card";

export default function Home() {
  return (
    <main className="p-8">
      <div className="space-y-6 mt-8">
        <h1 className="text-2xl font-bold">
          Upload Twitter Post by Automation
        </h1>
        <GeneratePost />
      </div>
      <div className="mt-20 grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-x-10 gap-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <TwitterCard key={i} />
        ))}
      </div>
    </main>
  );
}
