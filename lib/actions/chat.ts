'use server';

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

//biome-ignore lint:
export async function getMessagesFromDB(chatId: number): Promise<any[]> {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });

  const formattedMessages = messages.map((message) => ({
    id: message.id,
    role: message.role as "user" | "assistant" | "system",
    content: message.content,
    createdAt: message.createdAt,
  }))

  return formattedMessages;
}

/** Returns the primary chat id for the resume (creates a chat and sets resume.primaryChatId if none). */
export async function getChat(fileKeyOrId: string): Promise<number | null> {
  const id = Number.parseInt(fileKeyOrId, 10);
  const byId = /^\d+$/.test(fileKeyOrId) && !Number.isNaN(id);
  const resume = await prisma.resume.findUnique({
    where: byId ? { id } : { fileKey: fileKeyOrId },
  });

  if (!resume) {
    return null;
  }

  if (resume.primaryChatId != null) {
    return resume.primaryChatId;
  }

  const chat = await prisma.chat.create({
    data: {
      userId: resume.userId,
      title: null,
    },
  });

  await prisma.resume.update({
    where: { id: resume.id },
    data: { primaryChatId: chat.id },
  });

  return chat.id;
}

export async function saveMessage(content: string, chatId: number, role: "user" | "assistant") {
  try {
    const user = await currentUser();
    if (!user) {
      return;
    }
    const message = await prisma.message.create({
      data: {
        content,
        role,
        userId: user.id,
        chatId,
      },
    });

    console.log(message)
  } catch (error) {
    console.log(error)
  }
}

export type UserChatItem = {
  id: number;
  updatedAt: Date;
  title: string;
};

/** Fetch metadata for a single chat by id. Returns null if not found or not owned by user. */
export async function getChatMetadata(
  chatId: number,
  userId: string
): Promise<{ id: number; title: string } | null> {
  const chat = await prisma.chat.findFirst({
    where: { id: chatId, userId },
    include: {
      messages: {
        where: { role: "user" },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { content: true },
      },
    },
  });
  if (!chat) return null;
  const fallbackTitle = chat.messages[0]?.content?.slice(0, 50)?.trim()
    ? `${chat.messages[0].content.slice(0, 50).trim()}${(chat.messages[0].content?.length ?? 0) > 50 ? "..." : ""}`
    : "New chat";
  return {
    id: chat.id,
    title: chat.title?.trim() || fallbackTitle,
  };
}

/** List all chats for the user, most recently updated first. Uses chat.title when set, else first user message snippet or "New chat". */
export async function getUserChats(userId: string): Promise<UserChatItem[]> {
  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        where: { role: "user" },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { content: true },
      },
    },
  });
  return chats.map((c) => {
    const fallbackTitle = c.messages[0]?.content?.slice(0, 50)?.trim()
      ? `${c.messages[0].content.slice(0, 50).trim()}${(c.messages[0].content?.length ?? 0) > 50 ? "..." : ""}`
      : "New chat";
    return {
      id: c.id,
      updatedAt: c.updatedAt,
      title: c.title?.trim() || fallbackTitle,
    };
  });
}

/** Update chat title. Returns true if the chat belongs to the current user and was updated. */
export async function updateChatTitle(chatId: number, title: string): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;
  const normalized = title.trim().slice(0, 100);
  if (!normalized) return false;
  const result = await prisma.chat.updateMany({
    where: { id: chatId, userId: user.id },
    data: { title: normalized },
  });
  return result.count > 0;
}

/**
 * Create a new chat, or return the existing primary chat when fileKey is provided.
 * When fileKey is provided and the resume already has primaryChatId, returns that id (idempotent).
 * When fileKey is provided and the resume has no primary chat, creates one and sets resume.primaryChatId.
 * When fileKey is not provided, always creates a fresh unlinked chat (e.g. global "New chat").
 */
export async function createChat(userId: string, fileKey?: string): Promise<number> {
  if (fileKey?.trim()) {
    const id = Number.parseInt(fileKey, 10);
    const byId = /^\d+$/.test(fileKey) && !Number.isNaN(id);
    const resume = await prisma.resume.findUnique({
      where: byId ? { id } : { fileKey },
    });
    if (resume && resume.userId === userId) {
      if (resume.primaryChatId != null) {
        return resume.primaryChatId;
      }
      const chat = await prisma.chat.create({
        data: { userId, title: null },
      });
      await prisma.resume.update({
        where: { id: resume.id },
        data: { primaryChatId: chat.id },
      });
      return chat.id;
    }
  }
  const chat = await prisma.chat.create({
    data: { userId, title: null },
  });
  return chat.id;
}