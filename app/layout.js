import "./globals.css";
import Script from 'next/script';
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "The Squirrel",
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
        <div className="flex flex-col w-screen overflow-x-hidden">
          {children}
        </div>
        <Toaster />

      </body>
    </html>
  );
}
