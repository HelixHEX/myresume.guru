import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId") ?? "";
  const applications = await prisma.application.findMany({
    where: {
      companyId: companyId ? parseInt(companyId) : null,
    },
  });

  return NextResponse.json({ applications });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const user = await currentUser();

  const { title, url, resumeId, jobDescription } = await req.json();

  const application = await prisma.application.create({
    data: {
      userId: user!.id,
      title,
      url,
      description: jobDescription,
      currentResume: resumeId ? { connect: { id: resumeId } } : undefined,
      resumes: resumeId ? { connect: { id: resumeId } } : undefined,
    },
  });

  return NextResponse.json({ application });
}
// export async function POST(R)
