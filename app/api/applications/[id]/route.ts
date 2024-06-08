import prisma from "@/lib/prisma";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const application = await prisma.application.findUnique({
    where: {
      id: id ? parseInt(id) : undefined,
    },
    include: {
      applicationScores: true,
      currentResume: true,
      feedbacks: { include: { resume: true } },
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" });
  }

  if (!application.currentResume) {
    return NextResponse.json({ error: "Current resume not found" });
  }

  await prisma.application.update({
    where: {
      id: application.id,
    },
    data: {
      aiStatus: "analyzing",
    },
  });

  if (
    application.aiStatus !== "done" ||
    application.applicationScores.length === 0
  ) {
    const result = await generateObject({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "user",
          content: `This is a resume analysis tool. You will be analyzing a user-uploaded resume that has been converted to plain text and will see how well their resume matches the job description.
        

        Analysis:
          1. Identify key sections like "Summary," "Experience," "Skills," and "Education." Extract relevant information from each section (e.g., job titles, companies, skills, degrees).
          2. Provide scores for 
            * Relevant Skills: percentage out of 100 that the resume has relevant skills to the job description.
            * Work Experience: percentage out of 100 that the resume has relevant work experience to the job description.
            * Education: percentage out of 100 that the resume has relevant education to the job description.
            * Relevant Keywords: percentage out of 100 that the resume has relevant keywords to the job description.

        Job Description:
        ${application.description}

        Resume:
        ${application.currentResume.text}
        `,
        },
        // { role: "user", content: test.text },
      ],
      schema: ApplicationScoreSchema,
    });

    await prisma.applicationScore.createMany({
      data: result.object.scores.map((score) => ({
        title: score.title,
        score: score.score,
        userId: application.userId,
        applicationId: application.id,
        resumeId: application.currentResume!.id,
      })),
    });

    console.log(result.object);
  } else {
    await prisma.application.update({
      where: {
        id: application.id,
      },
      data: {
        aiStatus: "done",
      },
    });
  }
  await prisma.application.update({
    where: {
      id: application.id,
    },
    data: {
      aiStatus: "done",
    },
  });

  return NextResponse.json({ application });
}

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
    .describe(
      "An error message if the job description does not look like a  job description"
    ),
});
