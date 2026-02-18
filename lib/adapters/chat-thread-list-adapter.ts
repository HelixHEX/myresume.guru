"use client";

import type { unstable_RemoteThreadListAdapter } from "@assistant-ui/react";
import { createChat, getChatMetadata, getUserChats, updateChatTitle } from "@/lib/actions/chat";

export type CreateChatThreadListAdapterOptions = {
  userId: string;
  resumeFileKey?: string | null;
};

/**
 * RemoteThreadListAdapter that backs the assistant-ui ThreadList with our chat API.
 * Use with unstable_useRemoteThreadListRuntime so ThreadListPrimitive works.
 */
export function createChatThreadListAdapter(
  options: CreateChatThreadListAdapterOptions
): unstable_RemoteThreadListAdapter {
  const { userId, resumeFileKey } = options;

  return {
    async list() {
      const chats = await getUserChats(userId);
      return {
        threads: chats.map((c) => ({
          remoteId: String(c.id),
          status: "regular" as const,
          title: c.title,
          externalId: undefined,
        })),
      };
    },

    async fetch(threadId: string) {
      const meta = await getChatMetadata(Number(threadId), userId);
      if (!meta) throw new Error("Thread not found");
      return {
        remoteId: String(meta.id),
        status: "regular" as const,
        title: meta.title,
        externalId: undefined,
      };
    },

    async initialize(_threadId: string) {
      const newChatId = await createChat(userId, resumeFileKey ?? undefined);
      return { remoteId: String(newChatId), externalId: undefined };
    },

    async rename(remoteId: string, newTitle: string): Promise<void> {
      await updateChatTitle(Number(remoteId), newTitle);
    },

    async archive(_remoteId: string): Promise<void> {
      // No-op for now; could add archive flag to Chat model later
    },

    async unarchive(_remoteId: string): Promise<void> {
      // No-op
    },

    async delete(_remoteId: string): Promise<void> {
      // No-op for now; could add soft delete or real delete later
    },

    async generateTitle(_remoteId: string, _unstable_messages?: readonly unknown[]) {
      // Return empty stream; titles are set by setChatTitle tool in the chat API
      return new ReadableStream();
    },
  };
}
