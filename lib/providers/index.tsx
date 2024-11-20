import ClerkProvider from "./clerk";
import { PostHogProvider } from "./posthog";
import Query from "./query";
import { Analytics } from "@vercel/analytics/react"


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <ClerkProvider>
        <Query>{children}</Query>
      </ClerkProvider>
      <Analytics />
    </PostHogProvider>
  );
}
