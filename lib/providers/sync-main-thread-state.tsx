"use client";

import { useAssistantRuntime } from "@assistant-ui/react";
import type { RefObject } from "react";
import { useEffect } from "react";

type SyncMainThreadStateProps = {
  setSelectedChatId: (id: number | null) => void;
  /** When set, we only sync when runtime's remoteId matches this (URL as source of truth). Prevents loop when switching chats. */
  routeChatIdRef: RefObject<number | null>;
};

/**
 * Subscribes to the runtime thread list and syncs the main thread's remoteId to the provided setter.
 * Only updates when the runtime's remoteId matches the current route chat id (or route is "new"),
 * so the URL remains source of truth and we avoid infinite loops when switching chats.
 */
export function SyncMainThreadState({ setSelectedChatId, routeChatIdRef }: SyncMainThreadStateProps) {
  const assistantRuntime = useAssistantRuntime({ optional: true });

  let remoteId: string | undefined;
  try {
    remoteId = assistantRuntime?.threads.mainItem.getState().remoteId;
  } catch {
    remoteId = undefined;
  }

  useEffect(() => {
    const routeChatId = routeChatIdRef.current;
    const remoteNum = remoteId != null && /^\d+$/.test(remoteId) ? Number(remoteId) : null;
    // When on /app/chat/new we set route to null: keep selectedChatId null so URL stays on /app/chat/new
    if (routeChatId === null) {
      setSelectedChatId(null);
      return;
    }
    // Only sync when runtime agrees with route: prevents stale runtime from overwriting and causing URL/state loop
    if (routeChatId === undefined) {
      setSelectedChatId(remoteNum);
    } else if (remoteNum === routeChatId) {
      setSelectedChatId(remoteNum);
    }
  }, [remoteId, routeChatIdRef, setSelectedChatId]);

  return null;
}
