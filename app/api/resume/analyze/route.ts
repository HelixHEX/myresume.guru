import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateObject } from "ai";

// Define the schema for resume sections
const ResumeAnalysisSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedIn: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  }).describe("Personal information including contact details"),
  summary: z.string().optional().describe("Professional summary or objective statement"),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    location: z.string().optional(),
    graduationDate: z.string(),
    gpa: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })).describe("Educational background and achievements"),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    highlights: z.array(z.string()),
  })).describe("Work experience with detailed responsibilities and achievements"),
  skills: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()),
  })).describe("Technical and professional skills grouped by category"),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    url: z.string().url().optional(),
    highlights: z.array(z.string()).optional(),
  })).optional().describe("Notable projects with technologies used"),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    url: z.string().url().optional(),
  })).optional().describe("Professional certifications and credentials"),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;

export async function POST(req: Request) {
  try {
    const { fileKey } = await req.json();

    // Get the resume from the database
    const resume = await prisma.resume.findUnique({
      where: { fileKey },
    });

    if (!resume || !resume.text) {
      return NextResponse.json(
        { error: "Resume not found or text not available" },
        { status: 404 }
      );
    }

    // Analyze the resume using the AI SDK
    const result = await generateObject({
      model: openai("gpt-4"),
      messages: [
        {
          role: "system",
          content: `You are a resume parser that converts resume text into structured JSON data. 
          Extract all relevant information and format it according to the schema provided.
          Ensure all dates are in YYYY-MM format. Extract as much information as possible from the text.
          If a section is empty or not present in the resume, exclude it from the JSON.
          Be precise and accurate in your extraction.`,
        },
        {
          role: "user",
          content: resume.text,
        },
      ],
      schema: ResumeAnalysisSchema,
    });

    // Update resume status
    await prisma.resume.update({
      where: { id: resume.id },
      data: { status: "Analyzed" },
    });

    return NextResponse.json({ analysis: result.object });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}