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