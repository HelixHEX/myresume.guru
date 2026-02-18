"use client";

import type {
  GenericThreadHistoryAdapter,
  MessageFormatItem,
  MessageFormatRepository,
  ThreadHistoryAdapter,
} from "@assistant-ui/react";
import type { UIMessage } from "ai";
import { getMessagesFromDB } from "@/lib/actions/chat";

type DbMessage = { id: string; role: string; content: string };

function toUIMessage(m: DbMessage): UIMessage {
  return {
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    parts: [{ type: "text" as const, text: m.content }],
  };
}

/**
 * ThreadHistoryAdapter that loads messages from the DB for a given chat.
 * Used with useChatRuntime adapters.history so the chat UI is populated after load
 * (avoids empty initial state when useQuery is still loading).
 */
export function createChatHistoryAdapter(
  chatId: number
): ThreadHistoryAdapter {
  const emptyRepo = {
    headId: null as string | null,
    messages: [] as Array<{ message: import("@assistant-ui/core").ThreadMessage; parentId: string | null }>,
  };

  return {
    load: () => Promise.resolve(emptyRepo),
    append: () => Promise.resolve(),
    withFormat<TMessage, TStorageFormat extends Record<string, unknown>>(): GenericThreadHistoryAdapter<TMessage> {
      const chatIdRef = chatId;
      return {
        load: async (): Promise<MessageFormatRepository<TMessage>> => {
          const rows = await getMessagesFromDB(chatIdRef);
          const dbMessages = rows as DbMessage[];
          if (dbMessages.length === 0) {
            return { headId: null, messages: [] };
          }
          const messages: MessageFormatItem<TMessage>[] = dbMessages.map((m, i) => ({
            parentId: i === 0 ? null : dbMessages[i - 1]!.id,
            message: toUIMessage(m) as TMessage,
          }));
          const headId = dbMessages[dbMessages.length - 1]!.id;
          return { headId, messages };
        },
        append: () => Promise.resolve(),
      };
    },
  };
}
