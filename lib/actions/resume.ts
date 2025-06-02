'use server';

import { tasks } from "@trigger.dev/sdk/v3";
import prisma from "@/lib/prisma";

export async function startResumeAnalysis(fileKey: string, userId: string) {
  try {
    await tasks.trigger('analyze-resume', {
      fileKey,
      userId
    });
    return { success: true };
  } catch (error) {
    console.error("Error triggering analysis:", error);
    return {
      success: false,
      error: error instanceof Error ? error : "Failed to start analysis"
    };
  }
}
export async function RESUME_ANALYSIS_STATUS(fileKey?: string) {
  if (!fileKey) return { status: "Pending" };
  const resume = await prisma.resume.findUnique({
    where: { fileKey },
  });
  return { status: resume?.status };
}

export async function updateResume(args: {
  resumeId: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  summary?: string;
  skills?: string;
  workExperience?: string;
  education?: string;
  projects?: string;
  certifications?: string;
},) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: args.resumeId },
    });
    if (!resume) {
      console.log("Resume not found");
      return {
        success: false,
        message: "Resume not found",
      };
    }

    const updatedResume = await prisma.resume.update({
      where: { id: resume.id },
      data: {
        name: args.name,
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        phone: args.phone,
        location: args.location,
        website: args.website,
        github: args.github,
        linkedin: args.linkedin,
        twitter: args.twitter,
        summary: args.summary,
        skills: args.skills,
        workExperience: args.workExperience ? JSON.parse(args.workExperience) : resume.workExperience,
        education_new: args.education ? [JSON.parse(args.education)] : resume.education_new,
        projects: args.projects ? JSON.parse(args.projects) : resume.projects,
        certifications: args.certifications ? JSON.parse(args.certifications) : resume.certifications
      },
    });

    console.log("Updated resume", updatedResume);
    return {
      success: true,
      message: "Resume updated successfully",
    };
  } catch (error) {
    console.error("Error updating resume:", error);
    return {
      success: false,
      message: "Failed to update resume",
    };
  }
}