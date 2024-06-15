import AssistantProvider from "./ai";
import ClerkProvider from "./clerk";
import { PostHogProvider } from "./posthog";
import Query from "./query";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <ClerkProvider>
        <Query>{children}</Query>
      </ClerkProvider>
    </PostHogProvider>
  );
}
