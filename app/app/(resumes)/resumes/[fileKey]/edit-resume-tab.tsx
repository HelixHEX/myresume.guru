"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Thread } from "@/components/assistant-ui/thread";
import { ChatTrialLimitUpgrade, useChatTrialLimit } from "@/components/assistant-ui/chat-trial-limit-upgrade";
import Editor from "../../_components/editor";
import { useAppChatState } from "@/lib/providers/app-chat-provider";
import { useChatWidget } from "@/lib/contexts/chat-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatQueryKeys } from "@/lib/providers/app-chat-provider";
import { useGetResumeChat } from "../../lib/queries";
import { cn } from "@/lib/utils";
import { getMessagesFromDB } from "@/lib/actions/chat";
import { useAppChatRuntimeConfig } from "@/lib/contexts/app-chat-runtime-context";

const STORAGE_KEY = "resume-edit-mode";
type EditMode = "ai" | "editor";

const getStoredMode = (): EditMode => {
  if (typeof window === "undefined") return "ai";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "editor" ? "editor" : "ai";
};

export default function EditResumeTab({
  fileKey,
  resumeId,
}: {
  fileKey: string;
  resumeId: string;
}) {
  const searchParams = useSearchParams();
  const modeFromUrl = searchParams.get("mode") === "ai" ? "ai" : searchParams.get("mode") === "editor" ? "editor" : null;
  const effectiveInitial = modeFromUrl ?? getStoredMode();
  const [mode, setMode] = useState<EditMode>(effectiveInitial);
  const isOverTrialLimit = useChatTrialLimit();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const createdChatRef = useRef(false);
  const queryClient = useQueryClient();
  const { data: chatId = null, isPending: isChatPending } = useGetResumeChat(fileKey);
  const { ensureChatSelected, selectedChatId, handleNewChat } = useAppChatState();
  const { setResumeFileKey } = useChatWidget();
  const { setInitialMessagesForChat } = useAppChatRuntimeConfig();

  const messagesQuery = useQuery({
    queryKey: chatQueryKeys.messages(chatId!),
    queryFn: () => getMessagesFromDB(chatId!),
    enabled: mode === "ai" && chatId != null,
  });

  useEffect(() => {
    setResumeFileKey(fileKey);
    return () => setResumeFileKey(null);
  }, [fileKey, setResumeFileKey]);

  useEffect(() => {
    if (modeFromUrl != null && typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, modeFromUrl);
    }
  }, [modeFromUrl]);
  // When AI mode and no chat yet: create a new chat tied to this resume (pass fileKey so it links even if context is not set yet), then invalidate resume chat query.
  useEffect(() => {
    if (mode !== "ai" || chatId != null || !fileKey || createdChatRef.current) return;
    createdChatRef.current = true;
    setIsCreatingChat(true);
    handleNewChat(fileKey)
      .then((newId) => {
        if (newId != null) {
          queryClient.invalidateQueries({ queryKey: chatQueryKeys.resumeChat(fileKey) });
        }
      })
      .catch((err) => {
        console.error("Failed to create resume chat", err);
        createdChatRef.current = false;
      })
      .finally(() => setIsCreatingChat(false));
  }, [mode, chatId, fileKey, handleNewChat, queryClient]);

  // Prefetch messages then switch so the thread runtime gets initial messages (avoids history adapter remoteId timing).
  useEffect(() => {
    if (mode !== "ai" || chatId == null || selectedChatId === chatId) return;
    if (!messagesQuery.isSuccess || messagesQuery.data == null) return;
    setInitialMessagesForChat?.(chatId, messagesQuery.data as { id: string; role: string; content: string }[]);
    ensureChatSelected(chatId);
  }, [mode, chatId, selectedChatId, messagesQuery.isSuccess, messagesQuery.data, setInitialMessagesForChat, ensureChatSelected]);

  const handleModeChange = (newMode: EditMode): void => {
    setMode(newMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, newMode);
    }
  };

  // Only show Thread once main thread has switched to this chat (selectedChatId synced).
  // Showing earlier would let the user send with the wrong runtime and chat history would not save.
  const showFullScreenThread = mode === "ai" && chatId != null && selectedChatId === chatId;

  return (
    <>
      <div className={cn("p-4 md:px-8 flex w-full h-full min-h-0", showFullScreenThread && "hidden")}>
        <div className="w-full">
          <h1 className="text-4xl font-bold text-blue-800">Edit Resume</h1>
          <div className="mt-3 flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800" role="tablist" aria-label="Edit mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "ai"}
              aria-label="AI Chat mode"
              tabIndex={mode === "ai" ? 0 : -1}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                mode === "ai"
                  ? "bg-white text-blue-800 shadow dark:bg-neutral-950 dark:text-blue-200"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              )}
              onClick={() => handleModeChange("ai")}
            >
              AI Chat
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "editor"}
              aria-label="Editor mode"
              tabIndex={mode === "editor" ? 0 : -1}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                mode === "editor"
                  ? "bg-white text-blue-800 shadow dark:bg-neutral-950 dark:text-blue-200"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              )}
              onClick={() => handleModeChange("editor")}
            >
              Editor
            </button>
          </div>
          <div className="mt-4 min-h-[400px]">
            {mode === "editor" ? (
              <Editor resumeId={resumeId} />
            ) : mode === "ai" && !showFullScreenThread ? (
              <div className="h-[400px] flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-sm rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                {isChatPending || isCreatingChat
                  ? "Loading chat…"
                  : chatId == null
                  ? "No chat available for this resume."
                  : "Loading chat…"}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {showFullScreenThread && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-white dark:bg-neutral-950">
          <header className="shrink-0 border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
            <h1 className="text-xl font-bold text-blue-800 dark:text-blue-200">Edit Resume</h1>
            <div className="mt-2 flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800 w-fit" role="tablist" aria-label="Edit mode">
              <button
                type="button"
                role="tab"
                aria-selected={true}
                aria-label="AI Chat mode"
                className="flex-1 rounded-md px-3 py-2 text-sm font-medium bg-white text-blue-800 shadow dark:bg-neutral-950 dark:text-blue-200"
              >
                AI Chat
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={false}
                aria-label="Editor mode"
                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                onClick={() => handleModeChange("editor")}
              >
                Editor
              </button>
            </div>
          </header>
          <div className="flex flex-1 min-h-0">
            <main className="flex-1 min-w-0 min-h-0 overflow-hidden flex flex-col bg-white dark:bg-neutral-950">
              {isOverTrialLimit ? (
                <ChatTrialLimitUpgrade />
              ) : (
                <Thread key={chatId ?? "resume-chat"} />
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
