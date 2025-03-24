import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Providers from "@/lib/providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/fooer";

export const metadata: Metadata = {
	title: "myresume.guru",
	description: "Land your dream job with myresume.guru",
};
export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<Providers>
			<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
			{/* <Header /> */}
			{/* <div className="w-full min-h-screen h-auto"> */}
				{children}
			{/* </div> */}
			<Toaster />
		</Providers>
	);
}
