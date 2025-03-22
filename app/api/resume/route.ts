import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { tasks, configure } from "@trigger.dev/sdk/v3";

configure({
  // this is the default and if the `TRIGGER_SECRET_KEY` environment variable is set, can omit calling configure
  secretKey: process.env.TRIGGER_SECRET_KEY,
});

export async function GET(_request: NextRequest) {
  const user = await currentUser();

  if (!user) return;

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(resumes);
}

export async function POST() {
  const allResumes = await prisma.resume.findMany();
  for (let i = 0; i < allResumes.length; i++) {
    const resume = allResumes[i];
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        status: "Not Started"
      }
    })
    await tasks.trigger('analyze-resume', {
      fileKey: resume.fileKey
    });
  }
  return NextResponse.json({ message: "Resumes updated" });
}
