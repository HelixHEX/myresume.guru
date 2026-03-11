"use client";

import { useAssistantRuntime } from "@assistant-ui/react";
import { useEffect } from "react";

type SyncMainThreadStateProps = {
  setSelectedChatId: (id: number | null) => void;
};

/**
 * Subscribes to the runtime thread list and syncs the main thread's remoteId to the provided setter.
 * Must be rendered inside AssistantRuntimeProvider with a remote thread list runtime.
 */
export function SyncMainThreadState({ setSelectedChatId }: SyncMainThreadStateProps) {
  const assistantRuntime = useAssistantRuntime({ optional: true });

  let remoteId: string | undefined;
  try {
    remoteId = assistantRuntime?.threads.mainItem.getState().remoteId;
  } catch {
    remoteId = undefined;
  }

  useEffect(() => {
    setSelectedChatId(remoteId != null && /^\d+$/.test(remoteId) ? Number(remoteId) : null);
  }, [remoteId, setSelectedChatId]);

  return null;
}
