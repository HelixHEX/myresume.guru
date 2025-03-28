'use server';

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getMutableAIState } from "ai/rsc";
import prisma from "@/lib/prisma";

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

  return result.toDataStreamResponse();
}

//biome-ignore lint:
export async function getMessagesFromDB(chatId: number): Promise<any[]> {
  const messages = await prisma.message.findMany({
    where: {
      chatId,
    }
  })

  const formattedMessages = messages.map((message) => ({
    id: message.id,
    role: message.role as "user" | "assistant" | "system",
    content: message.content,
    createdAt: message.createdAt,
  }))

  return formattedMessages;
}

export async function getChat(resumeId: string) {
  if (Number.isNaN(Number.parseInt(resumeId))) {
    return null;
  }
  const resume = await prisma.resume.findUnique({
    where: {
      id: Number.parseInt(resumeId),
    },
  });

  if (!resume) {
    return null;
  }

  if (!resume.chatId) {
    const chat = await prisma.chat.create({
      data: {
        userId: resume.userId,
      },
    });

    await prisma.resume.update({
      where: {
        id: resume.id,
      },
      data: {
        chatId: chat.id,
      },
    });
  }

  return resume.chatId;
}