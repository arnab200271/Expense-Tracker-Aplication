
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from "@/app/Chatbot/page"
import Dashboard from "./dashboard/page";
import { Toaster } from "react-hot-toast";
import ProgressBarHandler from "./nprogressHandeler/nprogress";
import { CurrencyProvider } from "@/Utils/CurencyContext/Curencycontext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expenso",
  description: "Expense Tracker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <Toaster position="top-center"/>
        <div>
        <ProgressBarHandler/>
          <CurrencyProvider>{children}</CurrencyProvider> 
         <Chatbot/>
        </div>
    
      </body>
    </html>
  );
}
