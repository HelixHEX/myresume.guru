import ClerkProvider from "./clerk";
import { PostHogProvider } from "./posthog";
import Query from "./query";
import { Analytics } from "@vercel/analytics/react";
import { Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<ClerkProvider>
				<html lang="en">
					<body
						className={cn(
							" min-h-svh h-screen bg-white font-sans antialiased",
							manrope.variable,
						)}
					>
						<PostHogProvider>
							<Query>{children}</Query>
						</PostHogProvider>
					</body>
				</html>
			</ClerkProvider>
			<Analytics />
		</>
	);
}
