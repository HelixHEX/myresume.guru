import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import prisma from "@/lib/prisma";

// Schema for the resume analysis
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

// Schema for feedback generation
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

// Create the job for resume analysis
client.defineJob({
  id: "analyze-resume",
  name: "Analyze Resume",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "resume.uploaded",
    schema: z.object({
      resumeId: z.number(),
      fileKey: z.string(),
      userId: z.string(),
    }),
  }),
  run: async (payload, io) => {
    const { resumeId, fileKey, userId } = payload;

    // 1. Convert PDF to text
    await io.runTask("convert-pdf", async () => {
      const loader = new PDFLoader(fileKey);
      const docs = await loader.load();
      const text = docs.map(doc => doc.pageContent).join("\n");

      // Update resume with extracted text
      await prisma.resume.update({
        where: { id: resumeId },
        data: { text },
      });

      return text;
    });

    // 2. Analyze resume content
    const analysis = await io.runTask("analyze-content", async () => {
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
        select: { text: true },
      });

      if (!resume?.text) {
        throw new Error("Resume text not found");
      }

      const result = await generateObject({
        model: openai("gpt-4"),
        messages: [
          {
            role: "system",
            content: "You are an expert resume analyzer. Extract structured information from the resume text provided.",
          },
          {
            role: "user",
            content: resume.text,
          },
        ],
        schema: ResumeAnalysisSchema,
      });

      // Update resume with analysis
      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          analysis: result.object,
          status: "Analyzed",
          candidateName: result.object.personalInfo.name,
          candidateEmail: result.object.personalInfo.email,
          candidatePhone: result.object.personalInfo.phone,
          candidateLocation: result.object.personalInfo.location,
          technicalSkills: result.object.skills.flatMap(s => s.items),
          companies: result.object.experience.map(e => e.company),
          jobTitles: result.object.experience.map(e => e.title),
          education: result.object.education.map(e => e.institution),
        },
      });

      return result.object;
    });

    // 3. Generate feedback
    await io.runTask("generate-feedback", async () => {
      const result = await generateObject({
        model: openai("gpt-4"),
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
            content: JSON.stringify(analysis),
          },
        ],
        schema: FeedbackSchema,
      });

      // Create feedback entries in the database
      await prisma.$transaction(async (prisma) => {
        // Create improvement feedback entries with actionable steps
        const improvementPromises = result.object.improvements.map(async (improvement) => {
          const feedback = await prisma.feedback.create({
            data: {
              userId,
              type: "improvement",
              title: improvement.title,
              text: improvement.text,
              section: improvement.section,
              impact: improvement.impact,
              priority: improvement.priority,
              status: "active",
              resumeId,
            },
          });

          // Create actionable feedback items for each improvement
          const actionablePromises = improvement.actionableSteps.map((step) =>
            prisma.actionableFeedback.create({
              data: {
                userId,
                title: step.title,
                text: step.text,
                status: "not-done",
                priority: improvement.priority,
                difficultyLevel: step.difficulty,
                stepsList: step.steps,
                feedbackId: feedback.id,
                resumeId,
              },
            })
          );

          await Promise.all(actionablePromises);
          return feedback;
        });

        await Promise.all(improvementPromises);
      });

      return result.object;
    });
  },
}); 