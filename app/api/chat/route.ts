import { openai } from "@ai-sdk/openai";
import { streamText, stepCountIs, tool } from "ai";
import type { ModelMessage } from "ai";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

function findResumeByIdOrFileKey(idOrFileKey: string) {
	const id = Number(idOrFileKey);
	if (Number.isInteger(id) && String(id) === idOrFileKey) {
		return prisma.resume.findUnique({ where: { id } });
	}
	return prisma.resume.findUnique({ where: { fileKey: idOrFileKey } });
}

/** Request body: messages may have legacy `content` or UI SDK `parts`. */
type ChatRequestBody = {
	messages: Array<{ role: string; content?: string; parts?: Array<{ type: string; text?: string }> }>;
	context?: Array<{ role: string; content: string }>;
	fileKey: string;
	applicationId?: string | null;
	userId: string;
};

function getMessageText(msg: ChatRequestBody["messages"][number]): string {
	if (typeof msg.content === "string") return msg.content;
	if (Array.isArray(msg.parts)) {
		return msg.parts
			.filter((p): p is { type: string; text: string } => p.type === "text" && typeof (p as { text?: string }).text === "string")
			.map((p) => p.text)
			.join("");
	}
	return "";
}

export const maxDuration = 30;

const RECENT_MESSAGES_LIMIT = 20;
const GET_MORE_MESSAGES_DEFAULT_LIMIT = 10;

const getMoreMessagesSchema = z.object({
	beforeId: z.string().optional().describe("Message id (uuid) to fetch messages before (older). Omit for the first page."),
	beforeCreatedAt: z.string().optional().describe("ISO date string to fetch messages before. Alternative to beforeId."),
	limit: z.number().min(1).max(20).optional().default(GET_MORE_MESSAGES_DEFAULT_LIMIT),
});

const workExperienceItemSchema = z.object({
	company: z.string().optional(),
	title: z.string().optional(),
	summary: z.array(z.object({ summaryPoint: z.string() })).optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	location: z.string().optional(),
	current: z.boolean().optional(),
});
const educationItemSchema = z.object({
	school: z.string().optional(),
	degree: z.string().optional(),
	fieldOfStudy: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	location: z.string().optional(),
	achievements: z.string().optional(),
	current: z.boolean().optional(),
});
const projectItemSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	location: z.string().optional(),
	url: z.string().optional(),
});
const certificationItemSchema = z.object({
	name: z.string().optional(),
	date: z.string().optional(),
});

const modifyResumeSchema = z.object({
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
	workExperience: z.array(workExperienceItemSchema).optional().describe("Full list of work experience entries (company, title, summary bullets, startDate, endDate, location). Replace entire list when updating."),
	education: z.array(educationItemSchema).optional().describe("Full list of education entries (school, degree, fieldOfStudy, startDate, endDate, location). Replace entire list when updating."),
	projects: z.array(projectItemSchema).optional().describe("Full list of projects (name, description, startDate, endDate, location, url). Replace entire list when updating."),
	certifications: z.array(certificationItemSchema).optional().describe("Full list of certifications (name, date). Replace entire list when updating."),
});

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as ChatRequestBody;
		const { messages, context, fileKey, applicationId } = body;
		const userId = await auth().then((a) => a.userId);
		if (!userId) {
			return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
		}
		if (!fileKey || typeof fileKey !== "string" || fileKey.trim() === "") {
			return new Response(JSON.stringify({ error: "fileKey is required" }), { status: 400 });
		}

		const resume = await findResumeByIdOrFileKey(fileKey.trim()).then((r) =>
			r ? prisma.resume.findUnique({ where: { id: r.id }, include: { feedbacks: { include: { actionableFeedbacks: true } } } }) : null
		);

		if (!resume) {
			return new Response("Resume not found", { status: 404 });
		}
		if (resume.userId !== userId) {
			return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
		}

		// Ensure resume has a primary chat (create one and set primaryChatId if not)
		let chatId = resume.primaryChatId;
		if (chatId == null) {
			const chat = await prisma.chat.create({
				data: { userId: resume.userId },
			});
			await prisma.resume.update({
				where: { id: resume.id },
				data: { primaryChatId: chat.id },
			});
			chatId = chat.id;
		}

		// Persist latest user message
		const lastMessage = messages[messages.length - 1];
		if (lastMessage?.role === "user") {
			const content = getMessageText(lastMessage);
			if (content) {
				await prisma.message.create({
					data: {
						content,
						role: "user",
						userId,
						chatId,
						resumeId: resume.id,
						applicationId: applicationId ?? undefined,
					},
				});
			}
		}

		// Load recent messages for this chat (last N, chronological order)
		const recentDesc = await prisma.message.findMany({
			where: { chatId },
			orderBy: { createdAt: "desc" },
			take: RECENT_MESSAGES_LIMIT,
		});
		const modelMessages: ModelMessage[] = recentDesc.reverse().map((m) => ({
			role: m.role as "user" | "assistant" | "system",
			content: m.content,
		}));

		const contextMessages: ModelMessage[] = (context ?? []).map((c) => ({
			role: c.role as "user" | "assistant" | "system",
			content: c.content,
		}));
		const result = streamText({
			model: openai("gpt-4o-mini"),
			messages: [...contextMessages, ...modelMessages],
			stopWhen: stepCountIs(5),
			onFinish: async (event) => {
				const assistantText = event.text?.trim() ?? "";
				if (assistantText) {
					try {
						await prisma.message.create({
							data: {
								content: assistantText,
								role: "assistant",
								userId,
								chatId,
								resumeId: resume.id,
								applicationId: applicationId ?? undefined,
							},
						});
					} catch (err) {
						console.error("Failed to persist assistant message:", err);
					}
				}
			},
			system: `You are a resume analyzer assistant. Use getMoreMessages when the user asks about earlier parts of the conversation; pass nextCursor from a previous call to get the next page of history. Use getResumeStructured to fetch current workExperience, education, projects, certifications before editing (e.g. to remove an entry or add a bullet). Use modifyResume when the user wants to change their resume. You can update: name, summary, skills, contact info (firstName, lastName, email, phone, location), social links (website, github, linkedin, twitter), workExperience (full array of jobs with company, title, summary array of { summaryPoint }, startDate, endDate, location), education (full array with school, degree, fieldOfStudy, startDate, endDate, location), projects (full array with name, description, startDate, endDate, location, url), certifications (full array with name, date). For array fields pass the complete new array when updating. Only include fields the user asked to change.`,
			tools: {
				getResume: tool({
					description: "Get the current resume text and a brief summary. Use when the user asks about their resume content.",
					inputSchema: z.object({}),
					execute: async () => {
						const text = resume.text ?? "";
						return {
							resumeText: text.slice(0, 15000),
							summary: text ? "Resume loaded. Contains candidate info, experience, education, and skills." : "No resume text available.",
						};
					},
				}),
				getResumeStructured: tool({
					description: "Get the current resume as structured data (workExperience, education, projects, certifications, and scalar fields). Use before modifyResume when the user wants to edit or remove a specific entry (e.g. remove a job, add a bullet) so you can pass the full updated array.",
					inputSchema: z.object({}),
					execute: async () => {
						return {
							workExperience: (resume.workExperience ?? []) as unknown[],
							education: (resume.education_new ?? []) as unknown[],
							projects: (resume.projects ?? []) as unknown[],
							certifications: (resume.certifications ?? []) as unknown[],
							name: resume.name,
							summary: resume.summary ?? "",
							skills: resume.skills ?? "",
							firstName: resume.firstName ?? "",
							lastName: resume.lastName ?? "",
							email: resume.email ?? "",
							phone: resume.phone ?? "",
							location: resume.location ?? "",
							website: resume.website ?? "",
							github: resume.github ?? "",
							linkedin: resume.linkedin ?? "",
							twitter: resume.twitter ?? "",
						};
					},
				}),
				getFeedback: tool({
					description: "Get the structured feedback list already provided for this resume. Use when the user asks what feedback was given or what to improve.",
					inputSchema: z.object({}),
					execute: async () => {
						const feedbacks = resume.feedbacks ?? [];
						return {
							feedbacks: feedbacks.map((f) => ({
								title: f.title,
								text: f.text ?? "",
								actionableFeedbacks: (f as { actionableFeedbacks?: { title: string; text: string }[] }).actionableFeedbacks?.map((a) => ({
									title: a.title,
									text: a.text ?? "",
								})) ?? [],
							})),
						};
					},
				}),
				modifyResume: tool({
					description: "Update the resume. Pass any fields to change: name, summary, skills, contact (firstName, lastName, email, phone, location), social links (website, github, linkedin, twitter), workExperience (array of { company, title, summary: [{ summaryPoint }], startDate, endDate, location }), education (array of { school, degree, fieldOfStudy, startDate, endDate, location }), projects (array of { name, description, startDate, endDate, location, url }), certifications (array of { name, date }). For array fields pass the full replacement array.",
					inputSchema: modifyResumeSchema,
					execute: async (args) => {
						const data: Parameters<typeof prisma.resume.update>[0]["data"] = {};
						if (args.name !== undefined) data.name = args.name.trim() || resume.name;
						if (args.summary !== undefined) data.summary = args.summary.trim() || null;
						if (args.skills !== undefined) data.skills = args.skills.trim() || null;
						if (args.firstName !== undefined) data.firstName = args.firstName.trim() || null;
						if (args.lastName !== undefined) data.lastName = args.lastName.trim() || null;
						if (args.email !== undefined) data.email = args.email.trim() || null;
						if (args.phone !== undefined) data.phone = args.phone.trim() || null;
						if (args.location !== undefined) data.location = args.location.trim() || null;
						if (args.website !== undefined) data.website = args.website.trim() || null;
						if (args.github !== undefined) data.github = args.github.trim() || null;
						if (args.linkedin !== undefined) data.linkedin = args.linkedin.trim() || null;
						if (args.twitter !== undefined) data.twitter = args.twitter.trim() || null;
						if (args.workExperience !== undefined) data.workExperience = args.workExperience;
						if (args.education !== undefined) data.education_new = args.education;
						if (args.projects !== undefined) data.projects = args.projects;
						if (args.certifications !== undefined) data.certifications = args.certifications;
						if (Object.keys(data).length === 0) {
							return { success: false, message: "No fields to update." };
						}
						try {
							await prisma.resume.update({
								where: { id: resume.id },
								data,
							});
							return { success: true, updated: Object.keys(data), message: "Resume updated." };
						} catch (err) {
							const message = err instanceof Error ? err.message : "Update failed";
							console.error("modifyResume failed:", err);
							return { success: false, message };
						}
					},
				}),
				getMoreMessages: tool({
					description: "Fetch older messages from this conversation. Call when the user asks about earlier messages or 'what did I ask/say before'. Use nextCursor from the previous response to get the next page.",
					inputSchema: getMoreMessagesSchema,
					execute: async (args) => {
						const limit = args.limit ?? GET_MORE_MESSAGES_DEFAULT_LIMIT;
						let cursorDate: Date | null = null;
						if (args.beforeCreatedAt) {
							cursorDate = new Date(args.beforeCreatedAt);
						} else if (args.beforeId) {
							const before = await prisma.message.findUnique({
								where: { id: args.beforeId, chatId },
								select: { createdAt: true },
							});
							cursorDate = before?.createdAt ?? null;
						}

						const where: { chatId: number; createdAt?: { lt: Date } } = { chatId };
						if (cursorDate !== null) {
							where.createdAt = { lt: cursorDate };
						}

						const older = await prisma.message.findMany({
							where,
							orderBy: { createdAt: "desc" },
							take: limit + 1,
						});
						const hasMore = older.length > limit;
						const page = hasMore ? older.slice(0, limit) : older;
						const inOrder = [...page].reverse();
						const nextCursor = hasMore && inOrder.length > 0 ? inOrder[0].id : undefined;

						return {
							messages: inOrder.map((m) => ({
								id: m.id,
								role: m.role,
								content: m.content,
								createdAt: m.createdAt.toISOString(),
							})),
							hasMore,
							nextCursor,
						};
					},
				}),
			},
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Chat API error:", error);
		return new Response("Error", { status: 500 });
	}
}
