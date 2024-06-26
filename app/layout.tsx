import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Providers from "@/lib/providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "myresume.guru",
  description: "Land your dream job with myresume.guru",
};
const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          " min-h-svh h-screen bg-white font-sans antialiased",
          manrope.variable
        )}
      >
        <Providers>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Header />
          <div className="flex w-full flex-col h-auto min-h-screen pt-20">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
