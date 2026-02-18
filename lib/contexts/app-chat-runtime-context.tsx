"use client";

import React from "react";

export type DbMessage = { id: string; role: string; content: string };

export type AppChatRuntimeConfig = {
  userId: string;
  resumeFileKey: string | null;
  /** Prefetched messages so Chat is created with history (avoids useExternalHistory remoteId timing). */
  initialMessagesByChatIdRef?: React.MutableRefObject<Record<number, DbMessage[]>>;
  setInitialMessagesForChat?: (chatId: number, messages: DbMessage[]) => void;
};

const AppChatRuntimeConfigContext = React.createContext<AppChatRuntimeConfig | null>(null);

export const AppChatRuntimeConfigProvider = AppChatRuntimeConfigContext.Provider;

export const useAppChatRuntimeConfig = (): AppChatRuntimeConfig => {
  const ctx = React.useContext(AppChatRuntimeConfigContext);
  if (!ctx) throw new Error("useAppChatRuntimeConfig must be used within AppChatRuntimeConfigProvider");
  return ctx;
};
