import { AI } from "@/actions";
import AssistantUIProvider from "./assistant-ui";

export default function AIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AI>
      <AssistantUIProvider>{children}</AssistantUIProvider>
    </AI>
  );
}
