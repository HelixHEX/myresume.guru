import { logger, task } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import prisma from "@/lib/prisma";
import { getFile, getFileUrl, getUrl } from "@/lib/utils";
import { anthropic } from '@ai-sdk/anthropic';
import { editorSchema } from "../app/(resumes)/_components/editor";

// Schema for resume analysis
const ResumeAnalysisSchema = z.object({
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

// Schema for feedback generation
const FeedbackSchema = z.object({
  improvements: z.array(z.object({
    title: z.string(),
    text: z.string(),
    priority: z.number(),
  }))
});

// Task 1: Analyze Resume
export const analyzeResume = task({
  id: "analyze-resume",
  run: async ({ resumeId, userId, FREE_GEN }: { resumeId: string, userId: string, FREE_GEN?: boolean }) => {
    logger.info("Starting resume analysis", { resumeId });

    // Get the resume from the database
    const resume = await prisma.resume.findUnique({
      where: { id: Number.parseInt(resumeId) },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    // Get the PDF data

    const pdfData = resume.fileKey ? await getFile(resume.fileKey) : null;

    const { userId: clerkId, fileKey, status, text, analysis, candidateName, candidateEmail, candidatePhone, candidateLocation, technicalSkills, companies, jobTitles, education, chatId, ...resumeData } = resume

    await prisma.resume.update({
      where: { id: Number.parseInt(resumeId) },
      data: { status: "Analyzing resume", v2Started: true },
    });

    const messages = [
      {
        role: "system",
        content: `You are an advanced resume parser that extracts comprehensive information from resume text into structured JSON data.
        
        IMPORTANT JSON FORMATTING RULES:
        1. Ensure the JSON is properly formatted with no trailing commas
        2. ALL fields must be included in the response, even if empty
        3. For missing or unavailable information:
           - Use empty string ("") for missing text fields
           - Use empty array ([]) for missing array fields
           - Use "https://" for missing URL fields
           - Use "" for missing date fields (in YYYY-MM format when available)
        4. Never use "Not Provided", "N/A", or null values
        5. Ensure all arrays are properly terminated without trailing commas
        
        Extract the following information from the resume:
        
        Personal Information:
        - firstName
        - lastName
        - email
        - phone
        - location
        - website
        - github
        - linkedin
        - twitter
        - summary
        - skills

        Work Experience:
        - title
        - company
        -location
        -startDate
        -endDate
        -summary
        -technologies

        Education:
        - school
        - degree
        - fieldOfStudy
        - startDate
        - endDate
        - location
        - achievements

        Skils:
        - All skills
        
        Projects:
        - name
        - description
        - location
        - url
        - startDate
        - endDate
        
        Certifications:
        - name
        - date`,
      },
    ] as any

    if (resume.fileKey) {
      messages.push({
        role: "user",
        content: [
          {
            type: 'text',
            text: 'Here is the url for the resume pdf'
          },
          {
            type: 'file',
            data: getFileUrl(resume.fileKey),
            mimeType: "application/pdf",
          }
        ]
      })
    }
    logger.info('messages', messages as any)
    // Analyze the resume
    const result = await generateObject({
      model: anthropic("claude-3-5-haiku-latest"),
      messages,
      schema: editorSchema.required().strict(),
    }).catch((error) => {
      logger.error("Error analyzing resume", { error });
    });
    if (!result?.object) {
      logger.error("Failed to analyze resume - no result object");
      throw new Error("Failed to analyze resume");
    }


    // Update resume with analysis
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        firstName: result.object.firstName,
        lastName: result.object.lastName,
        email: result.object.email,
        phone: result.object.phone,
        location: result.object.location,
        website: result.object.website,
        github: result.object.github,
        linkedin: result.object.linkedin,
        twitter: result.object.twitter,
        summary: result.object.summary,
        skills: result.object.skills,
        workExperience: result.object.workExperience,
        education_new: result.object.education,
        projects: result.object.projects,
        certifications: result.object.certifications,
      },
    });

    logger.info("Resume analysis complete", { resumeId: resume.id });

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: userId,
      }
    })

    await generateFeedback.trigger({
      resumeId: resume.id,
      userId: resume.userId,
      length: subscription || FREE_GEN ? 5 : 2,
      FREE_GEN,
    });


    return { resumeId: resume.id, userId: resume.userId };
  }
});

// Task 2: Generate Feedback
export const generateFeedback = task({
  id: "generate-feedback",
  run: async ({ resumeId, userId, length, FREE_GEN }: { FREE_GEN?: boolean, resumeId: number; userId: string, length: number }) => {
    logger.info("Starting feedback generation", { resumeId });

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });


    if (!resume) {
      throw new Error("Resume or analysis not found");
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: userId,
      }
    })

    const improvements = await prisma.improvement.count({
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // 12am today
        },
      },
    });

    if (subscription) {
      if (subscription?.status !== 'active' && !FREE_GEN) {
        if (improvements >= 6 && !FREE_GEN) {
          await prisma.resume.update({
            where: { id: resumeId },
            data: { status: "Limit Reached" },
          });
          throw new Error("Daily Limit Reached");
        }
      }
    } else {
      if (improvements >= 6 && !FREE_GEN) {
        await prisma.resume.update({
          where: { id: resumeId },
          data: { status: "Limit Reached" },
        });
        throw new Error("Daily Limit Reached");
      }
    }

    await prisma.resume.update({
      where: { id: resumeId },
      data: { v2Started: true },
    });


    // const pdfData = resume.fileKey ? await getFile(resume.fileKey) : null;

    const { userId: clerkId, fileKey, status, text, analysis, candidateName, candidateEmail, candidatePhone, candidateLocation, technicalSkills, companies, jobTitles, education, chatId, ...resumeData } = resume

    const messages = [
      {
        role: "system",
        content: `You are an expert resume reviewer. Analyze the resume and provide EXACTLY ${length} actionable feedback for improvements.

        IMPORTANT GUIDELINES:
        1. Focus on providing clear, actionable improvements
        2. Each improvement should be self-contained and reference specific sections of the resume
        3. Rate priority (1-5, 5 being highest) based on impact on overall resume effectiveness
        4. For each improvement, provide detailed, actionable guidance in the text field
        
        For each improvement:
        - Provide a clear title that summarizes the improvement
        - In the text field, include:
          * Detailed explanation of what needs to be improved and why
          * Specific, actionable steps for implementation
          * Clear examples or suggestions where appropriate
        - Assign a priority (1-5) based on the potential impact`,
      },
      {
        role: "user",
        content: [
          {
            type: 'text',
            text: "The following is a json representation of the resume"
          },
          {
            type: 'text',
            text: JSON.stringify(resumeData)
          },
        ],
      },
    ] as any[]

    // if (resume.fileKey) {
    //   messages.push({
    //     role: "user",
    //     content: [
    //       {
    //         type: 'text',
    //         text: 'Here is the pdf resume'
    //       },
    //       {
    //         type: 'file',
    //         data: pdfData!,
    //         mimeType: "application/pdf",
    //       }
    //     ]
    //   })
    // }
    await prisma.resume.update({
      where: { id: resumeId },
      data: { status: "Generating feedback" },
    });

    // Generate feedback
    const result = await generateObject({
      model: anthropic("claude-3-5-haiku-latest"),
      messages,
      schema: FeedbackSchema,
    });

    logger.info("Feedback generation complete", { result });

    // Create improvement entries
    await prisma.$transaction(async (prisma) => {
      const improvementPromises = result.object.improvements.map((improvement) =>
        prisma.improvement.create({
          data: {
            userId,
            title: improvement.title,
            text: improvement.text,
            priority: improvement.priority,
            resumeId,
          },
        })
      );

      await Promise.all(improvementPromises);
    });

    // Update final status
    await prisma.resume.update({
      where: { id: resumeId },
      data: { status: "Analyzed", v2Conversion: true, v2Started: false },
      
    });

    logger.info("Feedback generation complete", { resumeId });
    return result.object;
  },
}); 