  'use server';

import { tasks } from "@trigger.dev/sdk/v3";
export async function startResumeAnalysis(fileKey: string) {
  try {
    await tasks.trigger('analyze-resume', {
      fileKey
    });
    return { success: true };
  } catch (error) {
    console.error("Error triggering analysis:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to start analysis" 
    };
  }
} 