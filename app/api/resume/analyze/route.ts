import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateObject } from "ai";

// Custom URL validator that allows empty strings and "Not Provided"
const urlSchema = z.string().transform((val) => {
  if (val === "Not Provided" || !val) return "";
  return val;
}).pipe(
  z.string().refine(
    (val) => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid URL format" }
  )
);

// Custom string validator that converts "Not Provided" to empty string
const optionalTextSchema = z.string().transform((val) => {
  return val === "Not Provided" ? "" : val;
});

// Define the schema for resume analysis
const ResumeAnalysisSchema = z.object({
  personalInfo: z.object({
    name: z.string().describe("Full name of the candidate"),
    email: z.string().email().optional().describe("Email address"),
    phone: optionalTextSchema.optional().describe("Phone number"),
    address: optionalTextSchema.optional().describe("Physical address"),
    summary: optionalTextSchema.optional().describe("Professional summary or objective"),
    socialLinks: z.object({
      linkedin: urlSchema.optional().describe("LinkedIn profile URL"),
      github: urlSchema.optional().describe("GitHub profile URL"),
      portfolio: urlSchema.optional().describe("Personal portfolio URL"),
      twitter: urlSchema.optional().describe("Twitter/X profile URL"),
      other: z.array(z.object({
        platform: z.string(),
        url: urlSchema,
      })).optional().describe("Other social media or relevant links"),
    }).describe("Social media and professional profiles"),
  }).describe("Personal and contact information"),
  skills: z.object({
    technical: z.array(z.string()).describe("Technical skills and technologies"),
    soft: z.array(z.string()).optional().describe("Soft skills and interpersonal abilities"),
    languages: z.array(z.string()).optional().describe("Programming and human languages"),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string().optional(),
      url: urlSchema.optional(),
    })).optional().describe("Professional certifications"),
  }).describe("Skills and qualifications"),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()).optional(),
    url: urlSchema.optional(),
    githubUrl: urlSchema.optional(),
    highlights: z.array(z.string()).optional(),
    duration: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
    }).optional(),
  })).describe("List of projects with details"),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    graduationDate: z.string(),
    gpa: z.string().optional(),
    honors: z.array(z.string()).optional(),
    relevantCourses: z.array(z.string()).optional(),
  })).describe("Educational background"),
  workExperience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    responsibilities: z.array(z.string()),
    achievements: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
  })).describe("Professional work experience"),
  additionalInfo: z.object({
    awards: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    publications: z.array(z.object({
      title: z.string(),
      publisher: z.string(),
      date: z.string(),
      url: urlSchema.optional(),
    })).optional(),
    volunteerWork: z.array(z.object({
      organization: z.string(),
      role: z.string(),
      duration: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    interests: z.array(z.string()).optional(),
  }).optional().describe("Additional professional and personal achievements"),
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
          content: `You are an advanced resume parser that extracts comprehensive information from resume text into structured JSON data.
          
          IMPORTANT JSON FORMATTING RULES:
          1. Ensure the JSON is properly formatted with no trailing commas
          2. For missing or unavailable information, use empty strings ("") or empty arrays ([]) instead of "Not Provided"
          3. All dates must be in YYYY-MM format (use empty string if not available)
          4. All URLs must include https:// prefix or be empty strings
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
          content: resume.text,
        },
      ],
      schema: ResumeAnalysisSchema,
    });

    // Extract all unique technical skills from work experience and projects
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

    // Update resume with analysis and denormalized fields
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        status: "Analyzed",
        analysis: result.object,
        // Store denormalized fields for better querying
        candidateName: result.object.personalInfo.name,
        candidateEmail: result.object.personalInfo.email || null,
        candidatePhone: result.object.personalInfo.phone || null,
        candidateLocation: result.object.personalInfo.address || null,
        technicalSkills: allTechnicalSkills,
        companies: result.object.workExperience.map(exp => exp.company),
        jobTitles: result.object.workExperience.map(exp => exp.title),
        education: result.object.education.map(edu => edu.institution)
      },
    });

    return NextResponse.json({ 
      analysis: result.object,
      message: "Resume analyzed and stored successfully" 
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to analyze resume: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}