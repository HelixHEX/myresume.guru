"use client";

import React, { createContext, useContext, useState } from "react";

type ChatContextValue = {
  /** When on a resume page, set this so "New chat" can link the chat to that resume. */
  resumeFileKey: string | null;
  setResumeFileKey: (fileKey: string | null) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const useChatWidget = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatWidget must be used within ChatWidgetProvider");
  return ctx;
};

export const ChatWidgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [resumeFileKey, setResumeFileKey] = useState<string | null>(null);
  const value: ChatContextValue = { resumeFileKey, setResumeFileKey };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
