"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { AssistantRuntimeProvider, Tools, unstable_useRemoteThreadListRuntime, useAui } from "@assistant-ui/react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createChat, getUserChats, type UserChatItem } from "@/lib/actions/chat";
import { useChatWidget } from "@/lib/contexts/chat-context";
import { AppChatRuntimeConfigProvider, type DbMessage } from "@/lib/contexts/app-chat-runtime-context";
import { createChatThreadListAdapter } from "@/lib/adapters/chat-thread-list-adapter";
import { useAppThreadRuntime } from "@/lib/providers/use-app-thread-runtime";
import { SyncMainThreadState } from "@/lib/providers/sync-main-thread-state";
import { chatToolkit } from "@/lib/tools/chat-toolkit";

/** Query keys for chat data. Use for invalidation. */
export const chatQueryKeys = {
  all: ["chats"] as const,
  list: (userId: string) => [...chatQueryKeys.all, "list", userId] as const,
  messages: (chatId: number) => [...chatQueryKeys.all, "messages", chatId] as const,
  /** Primary chat for a resume (by fileKey / resumeId). */
  resumeChat: (resumeIdOrFileKey: string) => [...chatQueryKeys.all, "resume_chat", resumeIdOrFileKey] as const,
};

export default function AppChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const { resumeFileKey } = useChatWidget();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const initialMessagesByChatIdRef = useRef<Record<number, DbMessage[]>>({});

  const setInitialMessagesForChat = useCallback((chatId: number, messages: DbMessage[]) => {
    initialMessagesByChatIdRef.current[chatId] = messages;
  }, []);

  const runtimeConfig = useMemo(
    () => ({
      userId,
      resumeFileKey: resumeFileKey ?? null,
      initialMessagesByChatIdRef,
      setInitialMessagesForChat,
    }),
    [userId, resumeFileKey, setInitialMessagesForChat]
  );

  const adapter = useMemo(
    () => createChatThreadListAdapter({ userId, resumeFileKey: resumeFileKey ?? undefined }),
    [userId, resumeFileKey]
  );

  // Multi-thread runtime: adapter backs the thread list from our DB. Each thread uses the
  // Vercel AI SDK via useAppThreadRuntime → useChatRuntime (@assistant-ui/react-ai-sdk).
  const runtime = unstable_useRemoteThreadListRuntime({
    adapter,
    runtimeHook: useAppThreadRuntime,
  });

  // Register tools with the recommended Tools() API (centralized, no duplicate registrations).
  // Tools execute on the backend (API route); we register description + parameters for UI.
  const aui = useAui({
    tools: Tools({ toolkit: chatToolkit }),
  });

  const chatsQuery = useQuery({
    queryKey: chatQueryKeys.list(userId),
    queryFn: () => getUserChats(userId),
    enabled: !!userId,
  });

  const chats = useMemo(() => chatsQuery.data ?? [], [chatsQuery.data]);

  const ensureChatSelected = useCallback(
    (chatId: number | null) => {
      if (chatId === null) {
        runtime.threads.switchToNewThread();
        setSelectedChatId(null);
        return;
      }
      const threadIdStr = String(chatId);
      const onSwitched = () => setSelectedChatId(chatId);
      // Public runtime.threads is a wrapper; internal core has getLoadThreadsPromise and __internal_load.
      type CoreThreads = { getLoadThreadsPromise: () => Promise<void>; __internal_load: () => void; _loadThreadsPromise?: Promise<void> };
      const core = (runtime as unknown as { _core?: { threads?: CoreThreads } })._core?.threads;
      const threads = runtime.threads;
      // Defer switch so we never run during render/effect; avoids "Entry not available in the store".
      const runSwitch = () => {
        let inList = false;
        try {
          inList = !!threads.getItemById(threadIdStr);
        } catch {
          // getItemById can throw if store entry not ready; treat as not in list.
        }
        if (inList) {
          threads.switchToThread(threadIdStr).then(onSwitched).catch((err) =>
            console.error("Failed to switch to thread", err)
          );
          return;
        }
        if (core && typeof core.__internal_load === "function" && typeof core.getLoadThreadsPromise === "function") {
          core._loadThreadsPromise = undefined;
          core.__internal_load();
          core.getLoadThreadsPromise().then(
            () =>
              threads.switchToThread(threadIdStr).then(onSwitched).catch((err) =>
                console.error("Failed to switch to thread after reload", err)
              ),
            (err) => console.error("Failed to load thread list before switch", err)
          );
        } else {
          threads.switchToThread(threadIdStr).then(onSwitched).catch((err) =>
            console.error("Failed to switch to thread", err)
          );
        }
      };
      queueMicrotask(runSwitch);
    },
    [runtime]
  );

  const clearSelectedChat = useCallback(() => {
    runtime.threads.switchToNewThread();
  }, [runtime]);

  const handleNewChat = useCallback((fileKeyOverride?: string): Promise<number | void> => {
    if (!userId) return Promise.resolve();
    const fileKeyToUse = fileKeyOverride ?? resumeFileKey ?? undefined;
    return createChat(userId, fileKeyToUse)
      .then((chatId) => {
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.list(userId) });
        if (fileKeyToUse) {
          queryClient.invalidateQueries({ queryKey: chatQueryKeys.resumeChat(fileKeyToUse) });
        }
        const threadIdStr = String(chatId);
        const threads = runtime.threads;
        type CoreThreads = { getLoadThreadsPromise: () => Promise<void>; __internal_load: () => void; _loadThreadsPromise?: Promise<void> };
        const core = (runtime as unknown as { _core?: { threads?: CoreThreads } })._core?.threads;
        const loadThenSwitch = (): Promise<void> => {
          if (core && typeof core.__internal_load === "function" && typeof core.getLoadThreadsPromise === "function") {
            core._loadThreadsPromise = undefined;
            core.__internal_load();
            return core.getLoadThreadsPromise().then(() => threads.switchToThread(threadIdStr));
          }
          return threads.switchToThread(threadIdStr);
        };
        return loadThenSwitch()
          .then(() => {
            setSelectedChatId(chatId);
            return chatId;
          })
          .catch((err) => {
            console.error("Failed to load or switch to new thread", err);
            return undefined;
          });
      })
      .catch((err) => {
        console.error("Failed to create chat", err);
        return undefined;
      });
  }, [userId, resumeFileKey, queryClient, runtime]);

  const handleSelectChat = useCallback(
    (chatId: number) => {
      runtime.threads.switchToThread(String(chatId));
    },
    [runtime]
  );

  const value = useMemo(
    () => ({
      chats,
      selectedChatId,
      selectedChat: selectedChatId != null ? { chatId: selectedChatId, messages: [] } : null,
      loadingChatId: null as number | null,
      handleSelectChat,
      handleNewChat,
      ensureChatSelected,
      clearSelectedChat,
    }),
    [chats, selectedChatId, handleSelectChat, handleNewChat, ensureChatSelected, clearSelectedChat]
  );

  return (
    <AppChatStateContext.Provider value={value}>
      <AppChatRuntimeConfigProvider value={runtimeConfig}>
        <AssistantRuntimeProvider aui={aui} runtime={runtime}>
          <SyncMainThreadState setSelectedChatId={setSelectedChatId} />
          {children}
        </AssistantRuntimeProvider>
      </AppChatRuntimeConfigProvider>
    </AppChatStateContext.Provider>
  );
}

type AppChatState = {
  chats: UserChatItem[];
  selectedChatId: number | null;
  selectedChat: { chatId: number; messages: DbMessage[] } | null;
  loadingChatId: number | null;
  handleSelectChat: (chatId: number) => void;
  handleNewChat: (fileKeyOverride?: string) => Promise<number | void>;
  ensureChatSelected: (chatId: number | null) => void;
  clearSelectedChat: () => void;
};

const AppChatStateContext = React.createContext<AppChatState | null>(null);

export const useAppChatState = () => {
  const ctx = React.useContext(AppChatStateContext);
  if (!ctx) throw new Error("useAppChatState must be used within AppChatProvider");
  return ctx;
};
