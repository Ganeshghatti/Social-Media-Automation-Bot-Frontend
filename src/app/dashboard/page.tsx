'use client'
import React from "react";
import ListCard from "@/components/global/list-card";
import { CountChat } from "@/components/chat/count-chat";
import { ReachChat } from "@/components/chat/reach-chat";

const Page = () => {
  const [stats, setStats] = React.useState([
    {
      label: "Posts Today",
      value: 0,
      percent: 0,
    },
    {
      label: "Scheduled Posts",
      value: 0,
      percent: 0,
    },
    {
      label: "Total Posts",
      value: 0,
      percent: 0,
    },
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.bot.thesquirrel.site/dashboard');
        const result = await response.json();
        
        if (result.success) {
          const { today, last7Days, thisMonth } = result.data;
          
          // Calculate percent changes
          const todayTotal = today.totalPosts;
          const yesterdayTotal = last7Days.dailyStats['2024-12-28'].totalPosts.all;
          const todayPercent = yesterdayTotal ? ((todayTotal - yesterdayTotal) / yesterdayTotal * 100).toFixed(1) : 0;
          
          const scheduledPercent = 0; // No historical scheduled data to compare
          
          const monthlyTotal = thisMonth.totalPosts;
          const avgDaily = monthlyTotal / 30;
          const monthlyPercent = avgDaily ? ((todayTotal - avgDaily) / avgDaily * 100).toFixed(1) : 0;

          setStats([
            {
              label: "Posts Today",
              value: today.totalPosts,
              percent: Number(todayPercent),
            },
            {
              label: "Scheduled Posts",
              value: today.scheduledPosts,
              percent: Number(scheduledPercent),
            },
            {
              label: "Total Posts",
              value: thisMonth.totalPosts,
              percent: Number(monthlyPercent),
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-[#A3A3A3]">Hi, Adarsh. Welcome back to us!</p>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <ListCard
              key={index}
              label={stat.label}
              value={stat.value}
              percent={stat.percent}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-10">
          <div className="col-span-2">
            <CountChat />
          </div>
          <ReachChat />
        </div>

        <h2 className="text-2xl font-bold mt-10">Recent Posts</h2>
        <p className="text-[#A3A3A3]">
          Here is the list of all the recent posts made through your Account
        </p>
      </div>
    </main>
  );
};

export default Page;