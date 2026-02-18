"use client";

import React from "react";

/**
 * When provided, the Thread's Send button will call this with the composer text instead of sending.
 * Used on /app/chat/new to create the chat and navigate with ?message= so the new page can send.
 */
export const ChatSendInterceptorContext = React.createContext<((text: string) => void) | null>(null);

export const useChatSendInterceptor = () => React.useContext(ChatSendInterceptorContext);
