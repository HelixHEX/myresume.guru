import { openai } from "@ai-sdk/openai";
import {  convertToModelMessages, streamText, tool } from "ai";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
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
    const clerk = await clerkClient()
    const { userId } = await auth();
    const { messages, chatId } = await req.json();


    const prevMessages = await prisma.message.findMany({
      where: {
        chatId,
      },
      take: 10,
      orderBy: {
        createdAt: "desc"
      }
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


    const user = await clerk.users.updateUserMetadata(userId!, {
      unsafeMetadata: {
        plan: "Plus",
        messageCount: resume.messageCount + 1
      }
    })

    // console.log(user.unsafeMetadata.messageCount as number);


    const { userId: clerkId, fileKey, status, text, analysis, candidateName, candidateEmail, candidatePhone, candidateLocation, technicalSkills, companies, jobTitles, education, ...resumeData } = resume

    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
      messages: [{
        role: "system",
        content: `You are a resume guru assistant. Here is the resume json format: ${JSON.stringify(resumeData)}. If a user asks for a specific change, update that specific field. Dont say you are going to use the updateResume tool, just update the resume.`
      }, ...formattedPrevMessages, ...convertToModelMessages(messages)],
      // tools: {
      //   getResume: tool({
      //     description: "Gets the resume json format",
      //     parameters: z.object({}),
      //     execute: async () => {
      //       return {
      //         resume: resumeData
      //       };
      //     },
      //   }),
      //   updateResume: tool({
      //     description: "Updates the resume with new or modified information, such as contact details, summary, skills, work experience, education, and more. Useful for handling user requests to revise specific sections of their resume through natural language interaction.",
      //     parameters: paramsSchema,
      //     execute: async (args: z.infer<typeof paramsSchema>) => {
      //       // console.log("Updating resume", args);
      //       await updateResume(args);
      //       return {
      //         success: true,
      //         message: "Resume updated successfully",
      //         event: "resume-updated",
      //         resumeId: args.resumeId
      //       };
      //     },
      //   }),
      // },
     
      // maxSteps: 3
    })
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Error", { status: 500 });
  }
}