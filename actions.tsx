"use server";

import prisma from "@/lib/prisma";
import { streamObject } from "ai";
import { createAI, createStreamableValue, StreamableValue } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function generateFeedback(
  fileKey: string
): Promise<StreamableValue<{ error?: string; feedbacks: Feedback[] }>> {
  try {
    let error = "";
    const resume = await prisma.resume.findUnique({
      where: { fileKey },
      include: { feedbacks: true },
    });
    
    if (!resume) {
      console.log("Resume not found");
      error = "Resume not found";
      const streamValue = createStreamableValue();
      streamValue.update({ error, feedbacks: [] });
      streamValue.done();
      return streamValue.value;
    }

    if (!resume.text) {
      console.log("Resume text not found");
      error = "Unable to convert pdf.";
      
      return createStreamableValue({ error, feedbacks: [] }).value;
    }

    if (resume.status === "Analyzed") {
      return createStreamableValue({
        feedbacks: resume.feedbacks,
      }).value;
    }

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
            "Your job is to act as a resume guru and analyze the following resume and provide at least 4 ways the user can improve their resume. ",
        },
        { role: "system", content: resume.text },
      ],
      schema: FeedbackSchema,
    });

    await prisma.resume.update({
      where: {
        fileKey,
      },
      data: {
        status: "Analyzed",
      },
    });
    return createStreamableValue(result.partialObjectStream).value;
  } catch (e: any) {
    let error = e.message;
    return createStreamableValue({ error, feedbacks: [] }).value;
  }
}

const FeedbackSchema = z.object({
  feedbacks: z
    .array(
      z.object({
        title: z.string(),
        text: z.string(),
      })
    )
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
  onSetAIState: ({ state, done }) => {
    "use server";

    if (done) {
      saveToDb(state);
    }
  },
  initialAIState: [],
  initialUIState: [],
});

export const runThread = async () => {
  const streamableStatus = createStreamableValue("thread.init");

  setTimeout(() => {
    streamableStatus.update("thread.run.create");
    streamableStatus.update("thread.run.update");
    streamableStatus.update("thread.run.end");
    streamableStatus.done("thread.end");
  }, 1000);

  return {
    status: streamableStatus.value,
  };
};

const saveToDb = (state: any) => {
  console.log(state);
};
