"use client";

import { ChatWidgetProvider } from "@/lib/contexts/chat-context";
import AppChatProvider from "@/lib/providers/app-chat-provider";

export default function AppChatLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ChatWidgetProvider>
      <AppChatProvider>{children}</AppChatProvider>
    </ChatWidgetProvider>
  );
}
