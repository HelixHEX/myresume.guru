"use server";

import prisma from "@/lib/prisma";
import { generateObject, streamObject } from "ai";
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
          content: `This is a resume analysis tool. You will be analyzing a user-uploaded resume that has been converted to plain text.
          
          Analysis:
            1. Identify key sections like "Summary," "Experience," "Skills," and "Education." Extract relevant information from each section (e.g., job titles, companies, skills, degrees).
            2. Provide Comprehensive Feedback:
                * Strengths: Identify at least two strengths of the resume based on clarity, structure, keyword usage, and action verbs. 
                * Actionable Improvements: Generate at least four specific, actionable suggestions for improvement across various aspects. You must also quote the text you are referring to.:
                    * Clarity and Concision: Recommend ways to improve sentence structure, tighten wording, or remove unnecessary information. 
                    * Readability: Suggest improvements to make the resume more engaging, easier to read, and more visually appealing.
                    * Keywords and Action Verbs: Identify relevant keywords for the target job (if provided) and suggest ways to incorporate them naturally. Suggest stronger action verbs to highlight achievements.
                    * Tailoring: Recommend ways to tailor the resume to a specific job description (if provided) by highlighting relevant skills and experiences. 
                    * Quantifiable Achievements:  Suggest ways to quantify achievements using numbers, percentages, or metrics.
          Error Handling:
            1. If the text does not include information that would be on a resume, do not provide any feedback at all and return an error message.
            
          Resume:
          ${resume.text}
            `,
        },
        // { role: "user", content: test.text },
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

// export async function generateApplicationFeedback(applicationId: number): Promise<{error?: string, response: {scores: ApplicationScore[]}}> {
//   const application = await prisma.application.findUnique({
//     where: { id: applicationId },
//     include: { feedbacks: {include: {resume: true }} },
//   });

//   if (!application) {
//     console.log("Application not found");
//     return {
//       error: "Application not found",
//       response: {scores: []},
//     };
//   }

//   if (application.feedbacks.length > 0 ) {
//     return {
//       error: "Already analyzed",
//       response: {scores: []},
//     }
//   }

//   const currentResume = await prisma.resume.findUnique({
//     where: { id: application.resumeId! },
//   });

//   if (!currentResume) {
//     console.log("Current resume not found");
//     return {
//       error: "Resume not found",
//       response: {scores: []},
//     };
//   }

//   await prisma.application.update({
//     where: {
//       id: applicationId,
//     },
//     data: {
//       aiStatus: "analyzing",
//     },
//   });

//   const result = await generateObject({
//     model: openai("gpt-3.5-turbo"),
//     messages: [
//       {
//         role: "user",
//         content: `This is a resume analysis tool. You will be analyzing a user-uploaded resume that has been converted to plain text and will see how well their resume matches the job description.
        

//         Analysis:
//           1. Identify key sections like "Summary," "Experience," "Skills," and "Education." Extract relevant information from each section (e.g., job titles, companies, skills, degrees).
//           2. Provide scores for 
//             * Relevant Skills: percentage out of 100 that the resume has relevant skills to the job description.
//             * Work Experience: percentage out of 100 that the resume has relevant work experience to the job description.
//             * Education: percentage out of 100 that the resume has relevant education to the job description.
//             * Relevant Keywords: percentage out of 100 that the resume has relevant keywords to the job description.

//         Job Description:
//         ${application.description}

//         Resume:
//         ${currentResume.text}
//         `,
//       },
//       // { role: "user", content: test.text },
//     ],
//     schema: ApplicationScoreSchema,
//   });

//   console.log(result);

//   await prisma.application.update({
//     where: {
//       id: applicationId,
//     },
//     data: {
//       aiStatus: "done",
//     },
//   });

//   return {
//     error: result.object.error ?? undefined,
//     response: {scores: result.object.scores},
//   };
// }

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

const ApplicationScoreSchema = z.object({
  scores: z
    .array(
      z.object({
        title: z.string().describe("The title of the section"),
        score: z.number().describe("The score of the skill"),
      })
    )
    .describe("The scores on the resume"),
  error: z
    .string()
    .optional()
    .describe("An error message if the job description does not look like a  job description"),
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
