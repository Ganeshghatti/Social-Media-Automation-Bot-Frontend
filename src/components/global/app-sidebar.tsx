'use client'
import { Calendar, Home, Inbox } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import LogoText from "./logo-txt";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Logout from "./log-out";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Twitter",
    url: "/dashboard/twitter",
    icon: Inbox,
  },
  {
    title: "LinkedIn",
    url: "/dashboard/linkedin",
    icon: Inbox,
  },
  {
    title: "Instagram",
    url: "/dashboard/instagram",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar variant="sidebar" className=" bg-customPrimary !px-6 !py-2">
      <SidebarHeader>
        <LogoText />
        <p className=" text-sm text-gray-500">Next Gen Automation Tool</p>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-4 mt-4">
        {items.map((item) => (
            <Link key={item.title} className={`text-black transition-all text-sm rounded-md py-2 px-4 ${pathname === item.url && "bg-customSecondary/10 !text-customSecondary font-semibold "}`} href={item.url}>
              {/* <item.icon /> */}
              <span>{item.title}</span>
            </Link>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Logout />
      </SidebarFooter>
    </Sidebar>
  );
}
