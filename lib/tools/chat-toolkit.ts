"use client";

import { type Toolkit } from "@assistant-ui/react";
import { z } from "zod";
import {
  SetChatTitleToolUI,
  GetResumeToolUI,
  GetResumeStructuredToolUI,
  GetFeedbackToolUI,
  GetSuggestedFeedbackToolUI,
  GetMoreMessagesToolUI,
  ModifyResumeToolUI,
} from "@/components/assistant-ui/tool-call-uis";

/**
 * Toolkit for the resume chat assistant. Tools execute on the backend (API route);
 * we register description + parameters + optional render here for the Tools() API.
 */
export const chatToolkit: Toolkit = {
  setChatTitle: {
    description:
      "Set or update the chat title. Use for new chats after the first exchange, or for existing chats when the topic has clearly shifted and a new title would help.",
    parameters: z.object({
      title: z.string().min(1).max(100).describe("Short descriptive title for the chat (max 100 characters)."),
    }),
    render: SetChatTitleToolUI,
  },
  getResume: {
    description: "Get the current resume text and a brief summary. Use when the user asks about their resume content.",
    parameters: z.object({}),
    render: GetResumeToolUI,
  },
  getResumeStructured: {
    description:
      "Get the current resume as structured data (workExperience, education, projects, certifications, and scalar fields). Use before modifyResume when the user wants to edit or remove a specific entry.",
    parameters: z.object({}),
    render: GetResumeStructuredToolUI,
  },
  getFeedback: {
    description: "Get the structured feedback list already provided for this resume. Use when the user asks what feedback was given or what to improve.",
    parameters: z.object({}),
    render: GetFeedbackToolUI,
  },
  getSuggestedFeedback: {
    description:
      "Fetch the latest suggested feedback for this resume from the database. Use when the user asks what to improve, what feedback was given, or for improvement suggestions.",
    parameters: z.object({}),
    render: GetSuggestedFeedbackToolUI,
  },
  getMoreMessages: {
    description:
      "Fetch older messages from this conversation. Call when the user asks about earlier messages or 'what did I ask/say before'. Use nextCursor from the previous response to get the next page.",
    parameters: z.object({
      beforeId: z.string().optional().describe("Message id (uuid) to fetch messages before (older). Omit for the first page."),
      beforeCreatedAt: z.string().optional().describe("ISO date string to fetch messages before. Alternative to beforeId."),
      limit: z.number().min(1).max(20).optional().default(10),
    }),
    render: GetMoreMessagesToolUI,
  },
  modifyResume: {
    description:
      "Update the resume. Pass any fields to change: name, summary, skills, contact (firstName, lastName, email, phone, location), social links (website, github, linkedin, twitter), workExperience, education, projects, certifications. For array fields pass the full replacement array.",
    parameters: z.object({
      name: z.string().min(1).optional().describe("Resume/document name"),
      summary: z.string().optional().describe("Professional summary"),
      skills: z.string().optional().describe("Skills section text"),
      firstName: z.string().optional().describe("Candidate first name"),
      lastName: z.string().optional().describe("Candidate last name"),
      email: z.string().optional().describe("Email"),
      phone: z.string().optional().describe("Phone"),
      location: z.string().optional().describe("Location"),
      website: z.string().url().optional().or(z.literal("")).describe("Personal website URL"),
      github: z.string().optional().describe("GitHub username"),
      linkedin: z.string().optional().describe("LinkedIn URL path"),
      twitter: z.string().optional().describe("Twitter/X username"),
      workExperience: z
        .array(
          z.object({
            company: z.string().optional(),
            title: z.string().optional(),
            summary: z.array(z.object({ summaryPoint: z.string() })).optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            location: z.string().optional(),
            current: z.boolean().optional(),
          })
        )
        .optional()
        .describe("Full list of work experience entries. Replace entire list when updating."),
      education: z
        .array(
          z.object({
            school: z.string().optional(),
            degree: z.string().optional(),
            fieldOfStudy: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            location: z.string().optional(),
            achievements: z.string().optional(),
            current: z.boolean().optional(),
          })
        )
        .optional()
        .describe("Full list of education entries. Replace entire list when updating."),
      projects: z
        .array(
          z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            location: z.string().optional(),
            url: z.string().optional(),
          })
        )
        .optional()
        .describe("Full list of projects. Replace entire list when updating."),
      certifications: z
        .array(
          z.object({
            name: z.string().optional(),
            date: z.string().optional(),
          })
        )
        .optional()
        .describe("Full list of certifications. Replace entire list when updating."),
    }),
    render: ModifyResumeToolUI,
  },
};
