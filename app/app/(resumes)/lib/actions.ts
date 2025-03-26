'use server';
import type { z } from "zod";
import type { editorSchema } from "../_components/editor/index";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function saveResume(resume: z.infer<typeof editorSchema>, resumeId: string) {
	const user = await currentUser();
	if (!user) {
		return { error: "User not found" };
	}
	if (resumeId) {
		const resumeDb = await prisma.resume.findUnique({
			where: {
				id: Number.parseInt(resumeId),
			},
		});
		if (!resumeDb) {
			return { error: "Resume not found" };
		}
		const updatedResume = await prisma.resume.update({
			where: { id: Number.parseInt(resumeId) },
			data: {
				name: resume.name,
				firstName: resume.firstName,
				lastName: resume.lastName,
				email: resume.email,
				phone: resume.phone,
				github: resume.github,
				linkedin: resume.linkedin,
				website: resume.website,
				twitter: resume.twitter,
				location: resume.location,
				summary: resume.summary,
				workExperience: resume.workExperience,
				education_new: resume.education,
				skills: resume.skills,
				certifications: resume.certifications,
				projects: resume.projects,
			},
		});

		return { success: "Resume saved", resumeId: updatedResume.id };
	}

	const newResume = await prisma.resume.create({
		data: {
			name: resume.name ?? "",
			userId: user.id,
			fileKey: "",
			firstName: resume.firstName,
			lastName: resume.lastName,
			email: resume.email,
			phone: resume.phone,
			github: resume.github,
			linkedin: resume.linkedin,
			website: resume.website,
			twitter: resume.twitter,
			location: resume.location,
			summary: resume.summary,
			workExperience: resume.workExperience,
			education_new: resume.education,
			skills: resume.skills,
			certifications: resume.certifications,
			projects: resume.projects,
		},
	});

	return { success: "Resume created", resumeId: newResume.id };
}
