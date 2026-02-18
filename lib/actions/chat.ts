'use server';

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getMutableAIState } from "@ai-sdk/rsc";
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

export async function continueConversation(input: string) {
  const history = getMutableAIState();
  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [...history.get(), { role: "user", content: input }],
  })

  return result.toUIMessageStreamResponse();
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