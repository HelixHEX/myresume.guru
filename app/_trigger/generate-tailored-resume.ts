import { logger, task } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import prisma from "@/lib/prisma";
import { getFile } from "@/lib/utils";

// Schema for job details
const JobDetailsSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string(),
  jobDescription: z.string(),
  requirements: z.string().optional(),
  location: z.string().optional(),
  source: z.string(),
  url: z.string(),
});

// Schema for tailored resume
const TailoredResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    summary: z.string(),
    socialLinks: z.object({
      linkedin: z.string(),
      github: z.string(),
      portfolio: z.string(),
      twitter: z.string(),
      other: z.array(z.object({
        platform: z.string(),
        url: z.string()
      }).required())
    }).required()
  }).required().strict(),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    languages: z.array(z.string()),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      url: z.string()
    }).required())
  }).required().strict(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    url: z.string(),
    githubUrl: z.string(),
    highlights: z.array(z.string()),
    duration: z.object({
      start: z.string(),
      end: z.string()
    }).required()
  }).required()),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    graduationDate: z.string(),
    gpa: z.string(),
    honors: z.array(z.string()),
    relevantCourses: z.array(z.string())
  }).required()),
  workExperience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    responsibilities: z.array(z.string()),
    achievements: z.array(z.string()),
    technologies: z.array(z.string())
  }).required()),
  additionalInfo: z.object({
    awards: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      description: z.string()
    }).required()),
    publications: z.array(z.object({
      title: z.string(),
      publisher: z.string(),
      date: z.string(),
      url: z.string()
    }).required()),
    volunteerWork: z.array(z.object({
      organization: z.string(),
      role: z.string(),
      duration: z.string(),
      description: z.string()
    }).required()),
    interests: z.array(z.string())
  }).required().strict()
}).required().strict();

export const generateTailoredResume = task({
  id: "generate-tailored-resume",
  run: async ({ 
    fileKey, 
    jobDetails 
  }: { 
    fileKey: string;
    jobDetails: z.infer<typeof JobDetailsSchema>;
  }) => {
    logger.info("Starting tailored resume generation", { fileKey, jobDetails });

    // Get the original resume from the database
    const resume = await prisma.resume.findUnique({
      where: { fileKey },
    });

    if (!resume || !resume.analysis) {
      throw new Error("Resume or analysis not found");
    }

    // Get the PDF data
    const pdfData = await getFile(fileKey);

    // Generate tailored resume
    const result = await generateObject({
      model: openai.responses("gpt-4o"),
      messages: [
        {
          role: "system",
          content: `You are an expert resume writer and career coach. Your task is to tailor a resume for a specific job posting.
          
          IMPORTANT GUIDELINES:
          1. Keep the core information (education, work history, etc.) but rephrase and reorganize to highlight relevant experience
          2. Emphasize skills and achievements that match the job requirements
          3. Use keywords from the job description naturally in the resume
          4. Maintain truthfulness - don't fabricate experience or skills
          5. Keep the same structure but optimize content for the target role
          
          Job Details:
          Title: ${jobDetails.jobTitle}
          Company: ${jobDetails.companyName}
          Description: ${jobDetails.jobDescription}
          Requirements: ${jobDetails.requirements || 'Not specified'}
          Location: ${jobDetails.location || 'Not specified'}
          
          Original Resume Analysis:
          ${JSON.stringify(resume.analysis, null, 2)}
          
          Generate a tailored version of the resume that:
          1. Highlights relevant experience and skills
          2. Uses industry-specific terminology
          3. Emphasizes achievements that align with the role
          4. Maintains professional tone and formatting
          5. Includes all required sections with optimized content`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Here is the original resume to tailor:",
            },
            {
              type: "file",
              data: pdfData,
              mimeType: "application/pdf",
            }
          ]
        },
      ],
      schema: TailoredResumeSchema,
    });

    if (!result?.object) {
      logger.error("Failed to generate tailored resume - no result object");
      throw new Error("Failed to generate tailored resume");
    }

    // Create a new resume entry for the tailored version
    const tailoredResume = await prisma.resume.create({
      data: {
        name: `${resume.name} - Tailored for ${jobDetails.companyName}`,
        userId: resume.userId,
        fileKey: `${fileKey}-tailored-${Date.now()}`,
        status: "Generated",
        analysis: result.object,
        candidateName: result.object.personalInfo.name,
        candidateEmail: result.object.personalInfo.email || null,
        candidatePhone: result.object.personalInfo.phone || null,
        candidateLocation: result.object.personalInfo.address || null,
        technicalSkills: result.object.skills.technical,
        companies: result.object.workExperience.map(exp => exp.company),
        jobTitles: result.object.workExperience.map(exp => exp.title),
        education: result.object.education.map(edu => edu.institution)
      },
    });

    logger.info("Tailored resume generation complete", { 
      originalResumeId: resume.id, 
      tailoredResumeId: tailoredResume.id 
    });

    return { 
      originalResumeId: resume.id, 
      tailoredResumeId: tailoredResume.id,
      fileKey: tailoredResume.fileKey
    };
  },
}); 