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

	if (Number.isNaN(Number.parseInt(resumeId))) {
		const resumeDB = await prisma.resume.create({
			data: {
				name: resume.resumeName ?? "",
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
				userId: user.id,
			}
		})
		return { success: "Resume created", resumeId: resumeDB.id };
	}

	const exists = await prisma.resume.findUnique({
		where: {
			id: Number.parseInt(resumeId)
		},
	})

	if (!exists || exists.userId !== user.id) {
		return { error: "Resume not found" };
	}

	const resumeDb = await prisma.resume.update({
		where: {
			id: Number.parseInt(resumeId)
		},
		data: {
			name: resume.resumeName ?? "",
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
		}
	})

	if (!resumeDb) {
		return { error: "Resume not found" };
	}

	return { success: "Resume created", resumeId: 21 };
}
