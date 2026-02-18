import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (
  _request: Request,
  props: { params: Promise<{ fileKey: string }> }
) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { fileKey: fileKeyParam } = await props.params;
  const source = await prisma.resume.findUnique({
    where: { fileKey: fileKeyParam },
  });

  if (!source) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }

  if (source.userId !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const copy = await prisma.resume.create({
    data: {
      name: `${source.name} (Copy)`,
      userId: source.userId,
      fileKey: null,
      status: "Not analyzed",
      text: source.text,
      analysis: source.analysis,
      v2Conversion: false,
      v2Started: false,
      messageCount: 0,
      pinned: false,
      tags: source.tags ?? [],
      candidateName: source.candidateName,
      candidateEmail: source.candidateEmail,
      candidatePhone: source.candidatePhone,
      candidateLocation: source.candidateLocation,
      technicalSkills: source.technicalSkills ?? [],
      companies: source.companies ?? [],
      jobTitles: source.jobTitles ?? [],
      education: source.education ?? [],
      firstName: source.firstName,
      lastName: source.lastName,
      email: source.email,
      phone: source.phone,
      location: source.location,
      website: source.website,
      github: source.github,
      linkedin: source.linkedin,
      twitter: source.twitter,
      summary: source.summary,
      skills: source.skills,
      workExperience: source.workExperience ?? [],
      education_new: source.education_new ?? [],
      projects: source.projects ?? [],
      certifications: source.certifications ?? [],
    },
  });

  return NextResponse.json({ resume: copy, id: copy.id });
};
