
import ClerkProvider from "./clerk";
import Query from "./query";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Query>{children}</Query>
    </ClerkProvider>
  );
}
