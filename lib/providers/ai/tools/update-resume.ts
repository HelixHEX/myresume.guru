import { tool } from "@assistant-ui/react";
import { z } from "zod";
import { updateResume } from "@/lib/actions/resume";
import { QueryClient } from "@tanstack/react-query";

const paramsSchema = z.object({
  resumeId: z.number(),
  resumeName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  github: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  summary: z.string(),
  skills: z.string(),
  workExperience: z.string(),
  education: z.string(),
  projects: z.string(),
  certifications: z.string(),
  achievements: z.string(),
});

type Params = z.infer<typeof paramsSchema>;

export const updateResumeTool = tool({
  description: "Update the resume with the new information",
  parameters: paramsSchema,
  execute: async (args: Params) => {
    const queryClient = new QueryClient();
    await updateResume(args);
    await queryClient.invalidateQueries({ queryKey: ["resume", args.resumeId] });
    return {
      success: true,
      message: "Resume updated successfully",
    };
  },
});