import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateObject } from "ai";
import { getFile } from "@/lib/utils";
import { anthropic } from "@ai-sdk/anthropic";
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

// Define the schema for feedback generation
const FeedbackSchema = z.object({
  improvements: z.array(z.object({
    title: z.string(),
    text: z.string(),
    section: z.string(),
    priority: z.number().min(1).max(5),
    impact: z.string(),
    actionableSteps: z.array(z.object({
      title: z.string(),
      text: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      steps: z.array(z.string()),
    })),
  })).describe("Areas for improvement with actionable steps"),
});

export type FeedbackAnalysis = z.infer<typeof FeedbackSchema>;

export async function POST(req: Request) {
  try {
    const { fileKey } = await req.json();

    // Get the resume and its analysis from the database
    const resume = await prisma.resume.findUnique({
      where: { fileKey },
    });

    if (!resume || !resume.analysis) {
      return NextResponse.json(
        { error: "Resume or analysis not found" },
        { status: 404 }
      );
    }

    // Generate feedback using the AI SDK
    const result = await generateObject({
      model: openai('gpt-4o'),
      messages: [
        {
          role: "system",
          content: `You are an expert resume reviewer and career coach. Analyze the resume and provide comprehensive feedback focusing on areas of improvement.

          IMPORTANT GUIDELINES:
          1. Be specific and actionable in your feedback
          2. Prioritize feedback based on impact and importance
          3. Provide detailed steps for implementing each improvement
          
          For each improvement:
          - Clearly explain the issue and its impact on the resume's effectiveness
          - Provide specific examples from the resume
          - Rate priority (1-5, 5 being highest) based on:
            * Impact on job search success
            * Ease of implementation
            * Industry standards
          - Include detailed, step-by-step implementation guidance
          
          Focus on these aspects:
          1. Content and Messaging
          - Clear value proposition
          - Achievement focus
          - Relevant experience highlighting
          - Metrics and quantifiable results
          
          2. Structure and Organization
          - Information hierarchy
          - Section organization
          - Content flow
          - Space utilization
          
          3. Technical Elements
          - Action verbs
          - Keywords and skills
          - Technical accuracy
          - Industry-specific terminology
          
          4. Visual Presentation
          - Formatting consistency
          - Readability
          - Professional appearance
          - ATS compatibility
          
          5. Industry Alignment
          - Industry-specific requirements
          - Role-specific keywords
          - Current trends compliance
          - Career progression clarity`,
        },
        {
          role: "user",
          content: [
            {
              type: 'text',
              text: 'Here is the resume analysis:',
            },
            {
              type: 'file',
              data: await getFile(resume.fileKey),
              mimeType: 'application/pdf'
            }
          ]
        }
      ],
      schema: FeedbackSchema,
    });

    // Create feedback entries in the database
    const feedbackEntries = await prisma.$transaction(async (prisma) => {
      // Create improvement feedback entries with actionable steps
      const improvementPromises = result.object.improvements.map(async (improvement) => {
        const feedback = await prisma.feedback.create({
          data: {
            userId: resume.userId,
            type: "improvement",
            title: improvement.title,
            text: improvement.text,
            section: improvement.section,
            impact: improvement.impact,
            priority: improvement.priority,
            status: "active",
            resumeId: resume.id,
          },
        });

        // Create actionable feedback items for each improvement
        const actionablePromises = improvement.actionableSteps.map((step) =>
          prisma.actionableFeedback.create({
            data: {
              userId: resume.userId,
              title: step.title,
              text: step.text,
              status: "not-done",
              priority: improvement.priority,
              difficultyLevel: step.difficulty,
              stepsList: step.steps,
              feedbackId: feedback.id,
              resumeId: resume.id,
            },
          })
        );

        await Promise.all(actionablePromises);
        return feedback;
      });

      return await Promise.all(improvementPromises);
    });

    return NextResponse.json({
      feedback: result.object,
      message: "Improvement feedback generated and stored successfully",
      count: feedbackEntries.length,
    });
  } catch (error) {
    console.error("Error generating feedback:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate feedback: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}