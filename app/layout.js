import { Inter } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/global/chat-bot";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
