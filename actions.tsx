"use server";

import prisma from "@/lib/prisma";
import { streamObject } from "ai";
import { createAI, createStreamableValue, StreamableValue } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function generateFeedback(fileKey: string): Promise<
  | {
      type: "http";
      response: { feedbacks: Feedback[]; message?: string };
    }
  | {
      type: "stream";
      response: StreamableValue<{ error?: string; feedbacks: Feedback[] }>;
    }
> {
  try {
    let error = "";
    const resume = await prisma.resume.findUnique({
      where: { fileKey },
      include: { feedbacks: {include: { resume: true }} },
    });

    if (!resume) {
      console.log("Resume not found");
      error = "Resume not found";
      const streamValue = createStreamableValue();
      streamValue.update({ error, feedbacks: [] });
      streamValue.done();
      return { type: "stream", response: streamValue.value };
    }

    if (!resume.text) {
      console.log("Resume text not found");
      error = "Unable to convert pdf.";

      return {
        type: "stream",
        response: createStreamableValue({ error, feedbacks: [] }).value,
      };
    }

    if (resume.status === "Analyzed" && resume.feedbacks.length > 0) {
      const feedbacks = resume.feedbacks;
      return {
        // response: { feedbacks: resume.feedbacks },
        type: "http",
        response: {feedbacks}
        // message: "Analyzed",
      };
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

    // result.rawRes

    await prisma.resume.update({
      where: {
        fileKey,
      },
      data: {
        status: "Analyzed",
      },
    });
    return {
      type: "stream",
      response: createStreamableValue(result.partialObjectStream).value,
    };
  } catch (e: any) {
    let error = e.message;
    return {
      type: "stream",
      response: createStreamableValue({ error, type: "stream", feedbacks: [] })
        .value,
    };
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
    console.log(state);
    if (done) {
      alert("hi");
      // saveToDb();
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

export const saveToDb = async (fileKey: string, feedback: Feedback[]) => {
  const resume = await prisma.resume.findUnique({ where: { fileKey } });
  if (!resume) {
    throw new Error("Unable to find resume");
  } else {
    await prisma.feedback.createMany({
      data: feedback.map((f) => ({
        ...f,
        resumeId: resume.id,
        userId: resume.userId,
      })),
    });
  }
  return resume;
};
