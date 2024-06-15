import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const applications = await prisma.application.findMany({
    include: {applicationScores: true},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const user = await currentUser();

  const { title, url, resumeId, jobDescription, companyId } = await req.json();

  const application = await prisma.application.create({
    data: {
      userId: user!.id,
      title,
      url,
      description: jobDescription,
      currentResume: resumeId ? { connect: { id: resumeId } } : undefined,
      resumes: resumeId ? { connect: { id: resumeId } } : undefined,
      company: companyId ? { connect: { id: companyId } } : undefined,
    },
  });


  return NextResponse.json({ application });
}
// export async function POST(R)
