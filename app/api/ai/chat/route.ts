import { saveMessageToDb } from "@/actions";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import prisma from "@/lib/prisma";
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    context,
    resumeId,
    applicationId,
    userId,
  }: {
    messages: any[];
    context: any[];
    resumeId?: Resume["id"];
    applicationId?: Application["id"];
    userId: string;
  } = await req.json();
  const message = messages[messages.length - 1];
console.log(message)
  await prisma.message.create({
    data: {
      content: message.content,
      role: message.role,
      userId: userId,
      createdAt: message.createdAt,
      resumeId,
      applicationId,
    },
  });
  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: [...context, ...messages],
  });

  return result.toAIStreamResponse();
}
