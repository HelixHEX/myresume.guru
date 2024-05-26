"use server";

import prisma from "@/lib/prisma";
import {
  streamObject,
} from "ai";
import {
  createAI,
  createStreamableUI,
} from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import ImprovementCard from "@/components/resumes/cards/improvement";
import pdf from "pdf-parse";

export async function generateFeedback(fileKey: string) {
  try {
    const streamableFeedback = createStreamableUI();

    const resume = await prisma.resume.findUnique({ where: { fileKey } });
    if (!resume) {
      console.log("Resume not found");
      return streamableFeedback.value;
    }

    const resumeText = await convertPDFToText(fileKey);

    await prisma.resume.update({
      where: {
        fileKey,
      },
      data: {
        status: "Analyzing",
      },
    });

    const result = await streamObject({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "user",
          content:
            "Your job is to act as a resume guru and analyze the following resume and provide at least 4 ways the user can improve their resume. If the text does not include information that would be on a resume, do not provide any feedback at all and return an error message.",
        },
        { role: "system", content: resumeText.text },
      ],
      schema: FeedbackSchema,
    });

    for await (const partialObject of result.partialObjectStream) {
      if (partialObject.feedback && partialObject.feedback.length > 0) {
        console.log(partialObject.feedback);
        streamableFeedback.update(
          partialObject.feedback.map((feedback, index) => (
            <ImprovementCard
              key={index}
              title={feedback?.title}
              text={feedback?.content}
            />
          ))
        );
      }
    }

    streamableFeedback.done();

    return streamableFeedback.value;
  } catch (e: any) {}
}

const FeedbackSchema = z.object({
  feedback: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .optional()
    .describe("The feedback on the resume"),
  error: z
    .string()
    .optional()
    .describe("An error message if the text does not look like a resume"),
});

export const AI = createAI({
  actions: {
    generateFeedback,
  },
  initialAIState: [],
  initialUIState: [],
});

export const convertPDFToText = async (fileKey: string) => {
  try {
    const url = process.env.UPLOADTHING_URL + fileKey;
    const res = await fetch(url);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return await pdf(buffer);
  } catch (e: any) {
    throw new Error(e.message);
  }
};
