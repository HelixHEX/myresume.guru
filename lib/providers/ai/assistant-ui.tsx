"use client";
import { useInitiateAssistantUI } from "@/lib/context/resume";
import {
  AssistantRuntimeProvider,
  useVercelUseChatRuntime,
} from "@assistant-ui/react";
export default function AssistantUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chat } = useInitiateAssistantUI();
  const runtime = useVercelUseChatRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
