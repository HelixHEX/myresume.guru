import { openai } from "@ai-sdk/openai";
import { appendClientMessage, appendResponseMessages, generateText, streamText } from "ai";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { LanguageModelV1Prompt } from "ai";
import { addMemories } from "@mem0/vercel-ai-provider";
import { createMem0 } from "@mem0/vercel-ai-provider";
import { anthropic } from "@ai-sdk/anthropic";
import { updateResumeTool } from "@/lib/providers/ai/tools/update-resume";
import { z } from "zod";
import { Params } from "next/dist/server/request/params";
import { updateResume } from "@/lib/actions/resume";
import { QueryClient } from "@tanstack/react-query";

export const maxDuration = 30;

const paramsSchema = z.object({
  resumeId: z.number(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string(),
  github: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  summary: z.string(),
  skills: z.string(),
  workExperience: z.string(),
  education: z.string(),
  projects: z.string(),
  certifications: z.string(),
  achievements: z.string(),
});

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
        content: `You are a resume guru assistant. Here is the resume json format: ${JSON.stringify(resumeData)}. If a user asks for a specific change, update that specific field. Dont say you are going to use the updateResume tool, just update the resume.`
      }, ...formattedPrevMessages, ...newMessages],
      tools: {
        updateResume: {
          name: "updateResume",
          parameters: paramsSchema,
          description: "Seamlessly updates an existing resume with new or modified information, such as contact details, summary, skills, work experience, education, and more. Ideal for handling user requests to revise specific sections of their resume through natural language interaction.",
          execute: async (args: z.infer<typeof paramsSchema>) => {
            console.log("Updating resume", args);
            await updateResume(args);
            return {
              success: true,
              message: "Resume updated successfully",
              event: "resume-updated",
              resumeId: args.resumeId
            };
          },
        },
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Error", { status: 500 });
  }
}