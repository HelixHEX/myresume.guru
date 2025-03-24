import { openai } from "@ai-sdk/openai";
import { appendClientMessage, appendResponseMessages, streamText } from "ai";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();
  const { messages, chatId } = await req.json();

  const prevMessages = await prisma.message.findMany({
    where: {
      chatId,
    },
  })

  const resume = await prisma.resume.findUnique({
    where: {
      id: chatId,
    },
    include: {
      improvements: true,
    },
  })

  const formattedPrevMessages = prevMessages.map((message) => ({
    id: message.id,
    role: message.role as "user" | "assistant" | "system",
    content: message.content,
    createdAt: message.createdAt,
  }))

  const message = messages[messages.length - 1]

  const newMessages = appendClientMessage({
    messages, message: {
      id: message.id,
      role: message.role as "user" | "assistant" | "system",
      content: message.content,
      createdAt: message.createdAt,
    }
  });

  await prisma.message.create({
    data: {
      content: message.content[0].text,
      role: message.role,
      userId: userId!,
      chatId,
    },
  });

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [{
      role: "system",
      content: `You are a resume guru assistant. Here is the resume text and improvements that have already been recommended. Resume: ${resume?.text} Improvements: ${resume?.improvements?.map((improvement) => `${improvement.title}: ${improvement.text}`).join(", ")}`
    }, ...formattedPrevMessages, ...newMessages],
    async onFinish({ response, text }) {
      await appendResponseMessages({
        messages,
        responseMessages: response.messages,
      })
      await prisma.message.create({
        data: {
          content: text,
          role: "assistant",
          userId: userId,
          chatId
        },
      });
    }
  });

  return result.toDataStreamResponse();
}