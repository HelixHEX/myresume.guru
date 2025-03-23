import { logger, task } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import prisma from "@/lib/prisma";
import { getFile } from "@/lib/utils";

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
  run: async ({ fileKey, userId }: { fileKey: string, userId: string }) => {
    logger.info("Starting resume analysis", { fileKey });

    // Get the resume from the database
    const resume = await prisma.resume.findUnique({
      where: { fileKey },
    });

    if (!resume) {
      throw new Error("Resume not found");
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
      if (subscription.status !== 'active') {
        if (improvements >= 3) {
          await prisma.resume.update({
            where: { fileKey },
            data: { status: "Limit Reached" },
          });
          throw new Error("Daily Limit Reached");
        }
      }
    } else {
      if (improvements >= 3) {
        await prisma.resume.update({
          where: { fileKey },
          data: { status: "Limit Reached" },
        });
        throw new Error("Daily Limit Reached");
      }
    }

    // Get the PDF data
    const pdfData = await getFile(fileKey);

    // Analyze the resume
    const result = await generateObject({
      model: openai.responses("gpt-4o"),
      messages: [
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
          
          Extract ALL relevant information including but not limited to:
          
          Personal Information:
          - Full name
          - Contact details (email, phone, address)
          - Professional summary/objective
          - All social and professional links (LinkedIn, GitHub, portfolio, etc.)
          
          Skills and Qualifications:
          - Technical skills (programming languages, tools, frameworks)
          - Soft skills
          - Languages (programming and human)
          - Certifications with details
          
          Projects:
          - Project names and descriptions
          - Technologies used
          - GitHub repositories
          - Live URLs
          - Key highlights and achievements
          - Duration/timeframes
          
          Education:
          - Degrees and institutions
          - Graduation dates
          - GPA if available
          - Honors and awards
          - Relevant coursework
          
          Work Experience:
          - Job titles and companies
          - Locations
          - Date ranges
          - Key responsibilities
          - Notable achievements
          - Technologies and tools used
          
          Additional Information:
          - Awards and recognition
          - Publications
          - Volunteer work
          - Interests and hobbies
          - Any other relevant professional information`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Here is the resume to analyze:",
            },
            {
              type: "file",
              data: pdfData,
              mimeType: "application/pdf",
            }
          ]
        },
      ],
      schema: ResumeAnalysisSchema,
    }).catch((error) => {
      logger.error("Error analyzing resume", { error });
    });

    if (!result?.object) {
      logger.error("Failed to analyze resume - no result object");
      throw new Error("Failed to analyze resume");
    }

    // Extract all unique technical skills
    const workExperienceSkills = result.object.workExperience
      ?.flatMap(exp => exp.technologies || [])
      .filter(Boolean) || [];

    const projectSkills = result.object.projects
      ?.flatMap(proj => proj.technologies || [])
      .filter(Boolean) || [];

    // Combine all technical skills and remove duplicates
    const allTechnicalSkills = [...new Set([
      ...(result.object.skills.technical || []),
      ...workExperienceSkills,
      ...projectSkills
    ])];

    // Update resume with analysis
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        analysis: result.object,
        candidateName: result.object.personalInfo.name,
        candidateEmail: result.object.personalInfo.email || null,
        candidatePhone: result.object.personalInfo.phone || null,
        candidateLocation: result.object.personalInfo.address || null,
        technicalSkills: allTechnicalSkills,
        companies: result.object.workExperience?.map(exp => exp.company) || [],
        jobTitles: result.object.workExperience?.map(exp => exp.title) || [],
        education: result.object.education?.map(edu => edu.institution) || [],
        status: "JSON Generated"
      },
    });



    logger.info("Resume analysis complete", { fileKey });

    if (subscription) {
      await generateFeedback.trigger({
        resumeId: resume.id,
        userId: resume.userId,
        length: 5,
      })
    } else {
      await generateFeedback.trigger({
        resumeId: resume.id,
        userId: resume.userId,
        length: 2,
      });
    }


    return { resumeId: resume.id, fileKey, userId: resume.userId };
  }
});

// Task 2: Generate Feedback
export const generateFeedback = task({
  id: "generate-feedback",
  run: async ({ resumeId, userId, length }: { resumeId: number; userId: string, length: number }) => {
    logger.info("Starting feedback generation", { resumeId });

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || !resume.analysis) {
      throw new Error("Resume or analysis not found");
    }

    const pdfData = await getFile(resume.fileKey);

    // Generate feedback
    const result = await generateObject({
      model: openai.responses("gpt-4o"),
      messages: [
        {
          role: "system",
          content: `You are an expert resume reviewer and career coach. Analyze the resume and provide EXACTLY ${length} actionable feedback for improvements.

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
              text: "The following is a json representation of the resume as well of the pdf resume."
            },
            {
              type: 'text',
              text: JSON.stringify(resume.analysis)
            },
            {
              type: 'file',
              data: pdfData,
              mimeType: "application/pdf",
            }
          ],
        },
      ],
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
      data: { status: "Analyzed" },
    });

    logger.info("Feedback generation complete", { resumeId });
    return result.object;
  },
}); 