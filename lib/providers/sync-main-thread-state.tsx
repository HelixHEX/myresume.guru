"use client";

import { useThreadList } from "@assistant-ui/react";
import { useEffect } from "react";

type SyncMainThreadStateProps = {
  setSelectedChatId: (id: number | null) => void;
};

/**
 * Subscribes to the runtime thread list and syncs the main thread's remoteId to the provided setter.
 * Must be rendered inside AssistantRuntimeProvider with a remote thread list runtime.
 */
export function SyncMainThreadState({ setSelectedChatId }: SyncMainThreadStateProps) {
  const mainItem = useThreadList((s) => s.mainItem);
  let remoteId: string | undefined;
  try {
    remoteId = mainItem?.getState?.().remoteId;
  } catch {
    remoteId = undefined;
  }

  useEffect(() => {
    setSelectedChatId(remoteId != null && /^\d+$/.test(remoteId) ? Number(remoteId) : null);
  }, [remoteId, setSelectedChatId]);

  return null;
}
