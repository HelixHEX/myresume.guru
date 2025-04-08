import { openai } from "@ai-sdk/openai";
import { appendClientMessage, appendResponseMessages, generateText, streamText } from "ai";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { LanguageModelV1Prompt } from "ai";
import { addMemories } from "@mem0/vercel-ai-provider";
import { createMem0 } from "@mem0/vercel-ai-provider";
import { anthropic } from "@ai-sdk/anthropic";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { messages, chatId } = await req.json();


    const prevMessages = await prisma.message.findMany({
      where: {
        chatId,
      },
    })


    const resume = await prisma.resume.findFirstOrThrow({
      where: {
        chatId,
      },
      include: {
        improvements: true,
      },
    })

    if (!resume) {
      return new Response("Resume not found", { status: 404 })
    }

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
        //biome-ignore lint:
        userId: userId!,
        chatId,
      },
    });

    const { userId: clerkId, fileKey, status, text, analysis, candidateName, candidateEmail, candidatePhone, candidateLocation, technicalSkills, companies, jobTitles, education, ...resumeData } = resume

    const result = await streamText({
      model: anthropic("claude-3-5-haiku-latest"),
      messages: [{
        role: "system",
        content: `You are a resume guru assistant. Here is the resume json format and improvements that have already been recommended. Resume in JSON format: ${JSON.stringify(resumeData)} Improvements generated: ${resume?.improvements?.map((improvement) => `${improvement.title}: ${improvement.text}`).join(", ")}`
      }, ...formattedPrevMessages, ...newMessages],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Error", { status: 500 });
  }
}