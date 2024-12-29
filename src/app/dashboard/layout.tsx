import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/global/app-sidebar";
import Navbar from "@/components/navbar/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className="md:hidden" />
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
