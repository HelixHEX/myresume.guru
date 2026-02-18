"use client";

import { useThreadListItem } from "@assistant-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createChatHistoryAdapter } from "@/lib/adapters/chat-history-adapter";
import { getMessagesFromDB } from "@/lib/actions/chat";
import { useAppChatRuntimeConfig } from "@/lib/contexts/app-chat-runtime-context";
import { chatQueryKeys } from "@/lib/providers/app-chat-provider";
import { useAppChatRuntime } from "@/lib/providers/use-app-chat-runtime";
import { AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

type DbMessage = { id: string; role: string; content: string };

const formatMessagesForRuntime = (messages: DbMessage[]) =>
  messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    parts: [{ type: "text" as const, text: m.content }],
  }));

/**
 * Hook used as runtimeHook for unstable_useRemoteThreadListRuntime.
 * Must be called inside ThreadListItemRuntimeProvider (so useThreadListItem() works).
 * Returns a per-thread runtime with messages loaded for that thread's remoteId (chat id).
 * Uses prefetched initial messages when set (e.g. from resume tab) so Chat is created with history;
 * otherwise relies on adapters.history (which can skip load if remoteId isn't set yet).
 */
export function useAppThreadRuntime() {
  const { userId, resumeFileKey, initialMessagesByChatIdRef } = useAppChatRuntimeConfig();
  const queryClient = useQueryClient();
  const item = useThreadListItem();
  const remoteId = item.remoteId;
  const chatId = remoteId != null && /^\d+$/.test(remoteId) ? Number(remoteId) : null;

  const prefetched = chatId != null ? initialMessagesByChatIdRef?.current[chatId] : undefined;
  const initialMessages = useMemo(
    () => (prefetched != null ? formatMessagesForRuntime(prefetched) : []),
    [prefetched]
  );

  const historyAdapter = useMemo(
    () => (chatId != null ? createChatHistoryAdapter(chatId) : undefined),
    [chatId]
  );

  const transport = useMemo(
    () =>
      new AssistantChatTransport({
        api: "/api/chat",
        body: {
          chatId: chatId ?? undefined,
          userId,
          ...(resumeFileKey ? { fileKey: resumeFileKey } : {}),
        },
      }),
    [chatId, userId, resumeFileKey]
  );

  useQuery({
    queryKey: chatQueryKeys.messages(chatId!),
    queryFn: () => getMessagesFromDB(chatId!),
    enabled: chatId != null,
  });

  const onFinish = useMemo(
    () => () => {
      if (chatId != null) {
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages(chatId) });
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.list(userId) });
      }
      if (resumeFileKey) {
        queryClient.invalidateQueries({ queryKey: ["resume", resumeFileKey] });
        queryClient.invalidateQueries({ queryKey: ["resume_editor_data", resumeFileKey] });
      }
    },
    [chatId, userId, resumeFileKey, queryClient]
  );

  return useChatRuntime({
    messages: initialMessages,
    transport: transport as Parameters<typeof useAppChatRuntime>[0]["transport"],
    adapters: { history: historyAdapter },
    onFinish,
  });
}
