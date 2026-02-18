'use server';
import type { z } from "zod";
import type { editorSchema } from "../_components/editor/index";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

function findResumeByIdOrFileKey(idOrFileKey: string) {
	const id = Number(idOrFileKey);
	if (Number.isInteger(id) && String(id) === idOrFileKey) {
		return prisma.resume.findUnique({ where: { id } });
	}
	return prisma.resume.findUnique({ where: { fileKey: idOrFileKey } });
}

export async function saveResume(resume: z.infer<typeof editorSchema>, resumeId: string) {
	const user = await currentUser();
	if (!user) {
		return { error: "User not found" };
	}

	const existing = await findResumeByIdOrFileKey(resumeId);

	if (!existing) {
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
				workExperience: resume.workExperience ?? [],
				education_new: resume.education ?? [],
				skills: resume.skills,
				certifications: resume.certifications ?? [],
				projects: resume.projects ?? [],
				userId: user.id,
			},
		});
		return { success: "Resume created", resumeId: String(resumeDB.id) };
	}

	if (existing.userId !== user.id) {
		return { error: "Resume not found" };
	}

	await prisma.resume.update({
		where: { id: existing.id },
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
			workExperience: resume.workExperience ?? [],
			education_new: resume.education ?? [],
			skills: resume.skills,
			certifications: resume.certifications ?? [],
			projects: resume.projects ?? [],
		},
	});

	return { success: "Resume created", resumeId: existing.fileKey ?? String(existing.id) };
}
