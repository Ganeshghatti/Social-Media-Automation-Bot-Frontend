import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "../components/ui/sidebar";

export const metadata = {
  title: "Social Media Bot",
  description: "Social Media Bot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`family-jakarta antialiased`}>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-TNSWCQXZTN`}
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TNSWCQXZTN');
          `}
        </Script>
        <SidebarProvider>
          <div className="flex flex-col w-screen">
            {children}
          </div>
        </SidebarProvider>
        <Toaster />

      </body>
    </html>
  );
}
