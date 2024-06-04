import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import pdf from "pdf-parse";
import { waitUntil } from "@vercel/functions";
import { getFeedback, makeStream, StreamingResponse } from "./utils";

export const GET = async (req: Request) => {
  // const { resumeId } = await req.json();

  const stream = makeStream(getFeedback());
  console.log(stream);
  const response = new StreamingResponse(stream);
  return response;
};

const wait = async (fileKey: string) => {
  await prisma.resume.update({
    where: { fileKey },
    data: { status: "Analyezed" },
  });
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("hi");
      resolve;
    }, 5000)
  );
};

export const POST = async (req: NextRequest) => {
  const { fileKey } = await req.json();
  try {
    const url = process.env.UPLOADTHING_URL + fileKey;
    const res = await fetch(url);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const test = await pdf(buffer);

    const resume = await prisma.resume.findUnique({ where: { fileKey } });
    if (!resume) return NextResponse.json("Resume not found");

    await prisma.resume.update({
      where: { fileKey },
      data: { status: "Analyzing" },
    });

    waitUntil(Promise.resolve(wait(fileKey)));

    const result = await streamObject({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "user",
          content: `This is a resume analysis tool. You will be analyzing a user-uploaded resume that has been converted to plain text.",
          
          Analysis:
            1. Identify key sections like "Summary," "Experience," "Skills," and "Education." Extract relevant information from each section (e.g., job titles, companies, skills, degrees).
            2. Provide Comprehensive Feedback:
                * Strengths: Identify at least two strengths of the resume based on clarity, structure, keyword usage, and action verbs. 
                * Actionable Improvements: Generate at least four specific, actionable suggestions for improvement across various aspects. You must also quote the text you are referring to.:
                    * Clarity and Concision: Recommend ways to improve sentence structure, tighten wording, or remove unnecessary information. 
                    * Formatting and Readability: Suggest improvements to formatting, including bullet points, white space, and font choice (if mentioned in the text).
                    * Keywords and Action Verbs: Identify relevant keywords for the target job (if provided) and suggest ways to incorporate them naturally. Suggest stronger action verbs to highlight achievements.
                    * Tailoring: Recommend ways to tailor the resume to a specific job description (if provided) by highlighting relevant skills and experiences. 
                    * Quantifiable Achievements:  Suggest ways to quantify achievements using numbers, percentages, or metrics.
                * Overall Tone and Style:  Evaluate the overall tone and style of the resume and suggest ways to make it more professional, confident, or achievement-oriented.
            3. Error Handling:
            If the text does not include information that would be on a resume, do not provide any feedback at all and return an error message.
            
          Resume:
          ${test.text}
            `,
        },
        { role: "user", content: test.text },
      ],
      schema: z.object({
        feedback: z
          .array(
            z.object({
              title: z.string().describe("The title of the feedback"),
              content: z.string().describe("The content of the feedback"),
            })
          )
          .optional()
          .describe("The feedback on the resume"),
        error: z
          .string()
          .optional()
          .describe("An error message if the text does not look like a resume"),
      }),
    });

    let accumlatedStr = "";
    for await (const partialObject of result.partialObjectStream) {
      if (partialObject.feedback) {
        accumlatedStr += partialObject.feedback;
        console.log(partialObject.feedback);
        while (isCompleteObject(accumlatedStr)) {
          const compeleteObject = accumlatedStr;
          console.log(compeleteObject);
        }
      }
    }

    return NextResponse.json("Resume is being analyzed");

    // return NextResponse.json(result.object);
  } catch (e) {
    console.log(e);
    return NextResponse.json("An error occurred");
  }
};

const isCompleteObject = (str: string) => {
  let openBracesCount = 0;
  for (const char of str) {
    if (char === "{") openBracesCount++;
    else if (char === "}") openBracesCount--;
    if (openBracesCount === 0) return true;
  }
  return false;
};

const removeProcessedString = (str: string) => {
  const index = str.indexOf("}") + 1;
  return str.substring(index);
};
