"use server";

import prisma from "@/lib/prisma";
import { generateObject, streamObject, type StreamObjectResult } from "ai";
import { createAI, createStreamableValue, type StreamableValue } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { connect } from "http2";
import { toast } from "sonner";
import { Stream } from "stream";

export async function generateFeedback(
  fileKey: string
): Promise<ApiResponse | StreamableApiResponse> {
  try {
    let error = "";
    const resume = await prisma.resume.findUnique({
      where: { fileKey },
      include: {
        feedbacks: { include: { resume: true, actionableFeedbacks: true } },
      },
    });

    if (!resume) {
      console.log("Resume not found");
      error = "Resume not found";
      // const streamValue = createStreamableValue();
      // streamValue.update({ error, feedbacks: [] });
      // streamValue.done();
      // return { type: "stream", response: streamValue.value };
      return {
        type: "http",
        response: { error },
      };
    }

    if (!resume.text) {
      console.log("Resume text not found");
      error = "Unable to convert pdf.";

      return {
        type: "http",
        response: { error },
      };
    }

    if (resume.status === "Analyzed" && resume.feedbacks.length > 0) {
      const feedbackss = resume.feedbacks;
      return {
        type: "http",
        response: { feedbacks: feedbackss },
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
          content: `This is a resume analysis tool. You will be analyzing a user-uploaded resume that has been converted to plain text.
          
          Analysis:
            1. Identify key sections like "Summary," "Experience," "Skills," and "Education." Extract relevant information from each section (e.g., job titles, companies, skills, degrees).
            2. Provide Comprehensive Feedback:
                * Strengths: Identify at least two strengths of the resume based on clarity, structure, keyword usage, and action verbs. 
                * Actionable Feedback: Generate at least four specific, actionable suggestions for improvement across various aspects. You must also quote the text you are referring to.:
                    * Clarity and Concision: Recommend ways to improve sentence structure, tighten wording, or remove unnecessary information. 
                    * Readability: Suggest improvements to make the resume more engaging, easier to read, and more visually appealing.
                    * Keywords and Action Verbs: Identify relevant keywords for the target job (if provided) and suggest ways to incorporate them naturally. Suggest stronger action verbs to highlight achievements.
                    * Tailoring: Recommend ways to tailor the resume to a specific job description (if provided) by highlighting relevant skills and experiences. 
                    * Quantifiable Achievements:  Suggest ways to quantify achievements using numbers, percentages, or metrics.
          Error Handling:
            1. If the text does not include information that would be on a resume, do not provide any feedback at all and return an error message. Also if there is not error, do not return an error message.
            

          Response Format:
            1. You should return a JSON object with a feedbacks array and an error message. The error message should be a string that is optional.
            2. Example JSON response (Keep in mind the writing used is for illustration purposes. The actual resposne should be related to the resume and remember uyou must also quote the text from the resume you are referring to.):
            {
              "feedbacks": [
                {
                  "title": "Strengths",
                  "actionableFeedbacks": [
                    {
                      "title": "Readability",
                      "text": "The reusme is well-written and easy to read. The sentences are clear and concise, and the formatting is consistent."
                    },
                    {
                      "title": "Structure",
                      "text": "The resume is well-structured and easy to follow. The sections are well-organized and the information is presented in a logical order."
                    },
                  ]
                },
                {
                  "title": "Actionable Feedback",
                  "actionableFeedbacks": [
                    {
                      "title": "Clarity and Concision",
                      "text": "The resume could be more concise and clear. The sentences could be shortened and the information could be presented in a more concise manner."
                    },
                    {
                      "title": "Readability",
                      "text": "The resume could be more engaging and easier to read. The sentences could be rephrased and the formatting could be improved."
                    },
                    {
                      "title": "Keywords and Action Verbs",
                      "text": "The resume could be more tailored to the job description. The keywords could be used more effectively and the action verbs could be stronger."
                    },
                    {
                      "title": "Tailoring",
                      "text": "The resume could be more specific to the job description. The skills and experiences could be highlighted more effectively and the formatting could be improved."
                    },
                    {
                      "title": "Quantifiable Achievements",
                      "text": "The resume could be more quantifiable. The achievements could be presented in a more specific and measurable way."
                    },
                  ]
            Resume:

          ${resume.text}
            `,
        },
        // { role: "user", content: test.text },
      ],
      schema: FeedbackSchema,
    });
    // console.log(result)

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
      response: createStreamableValue({ feedbacks: result.partialObjectStream })
        .value,
    } satisfies StreamableApiResponse;
  } catch (e: any) {
    let error = e.message;
    return {
      type: "http",
      response: { error },
    };
  }
}

export async function saveMessageToDb({
  message,
  resumeId,
  userId,
  applicationId,
}: {
  message: MessageInput;
  resumeId?: Resume["id"];
  applicationId?: Application["id"];
  userId: string;
}) {
  if (!message.content) {
    toast.error("No message content provided");
    return;
  }

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
}

export async function getMessagesFromDb(resumeId: number) {
  const messages = await prisma.message.findMany({
    where: {
      resumeId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  console.log(messages);
  return messages;
}

const FeedbackSchema = z.object({
  feedbacks: z
    .array(
      z.object({
        title: z.string(),
        // text:
        actionableFeedbacks: z
          .array(
            z.object({
              title: z.string(),
              text: z.string(),
            })
          )
          .optional(),
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
    state;
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

export const saveToDb = async (fileKey: string, feedbacks: Feedback[]) => {
  const resume = await prisma.resume.findUnique({ where: { fileKey } });
  if (!resume) {
    throw new Error("Unable to find resume");
  } else {
    for (var i = 0; i < feedbacks.length; i++) {
      const feedback: Feedback = feedbacks[i];

      const feedbackDB = await prisma.feedback.create({
        data: {
          title: feedback.title,
          resume: { connect: { id: resume.id } },
          userId: resume.userId,
        },
      });

      const actionableFeedbackDB = await prisma.actionableFeedback.createMany({
        data: feedback.actionableFeedbacks!.map((f) => ({
          ...f,
          userId: resume.userId,
          // resume: { connect: { id: resume.id } },
          resumeId: resume.id,
          feedbackId: feedbackDB.id,
          // feedback: { connect: { id: feedbackDB.id } },
        })),
      });
    }
  }
  return resume;
};

type ApiResponse = {
  type: "http";
  response: { feedbacks?: Feedback[]; error?: string; message?: string };
};
type StreamableApiResponse = {
  type: "stream";
  // response: StreamableValue<
  //   {
  //     feedbacks?: StreamObjectResult<Feedback> | [];
  //     error?: string;
  //     message?: string;
  //   },
  //   any
  // >;
  response:StreamableValue<any, any>

  error?: string | null | undefined;
  message?: string | null | undefined;
  // response: {
  //   error?: string | null | undefined;
  //   feedbacks?: Feedback[];
  //   message?: string | null | undefined;
  // }
};

type FeedbackStreamableValue =  | []

type AsyncIterableStream<T> = AsyncIterable<T> & ReadableStream<T>;
