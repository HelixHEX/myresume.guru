import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import PDFParser from "pdf2json"; // To parse the pdf

import pdf from "pdf-parse";

export const GET = () => {
  return NextResponse.json("hi");
};

export const POST = async () => {
  try {
    const url = `${process.env.UPLOADTHING_URL}61b6e779-7250-442f-86f5-fc8c909e645f-mak0wl.pdf`;
    const res = await fetch(url);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const test = await pdf(buffer);
    console.log(test.text);

    const result = await generateObject({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "user",
          content:
            "Your job is to act as a resume guru and analyze the following resume and provide at least 4 ways the user can improve their resume. If the text does not include information that would be on a resume, do not provide any feedback at all and return an error message.",
        },
        { role: "system", content: test.text },
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
        error: z.string().optional().describe("An error message if the text does not look like a resume"),
      }),
    });

    return NextResponse.json(result.object);
  } catch (e) {
    console.log(e);
    return NextResponse.json("An error occurred");
  }
};
