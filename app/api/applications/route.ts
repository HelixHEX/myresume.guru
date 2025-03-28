import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const user = await currentUser();
  const applications = await prisma.application.findMany({
    include: { applicationScores: true },
    orderBy: { createdAt: "desc" },
    where: {
      userId: user!.id,
    },
  });

  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const user = await currentUser();
  const application = await request.json();

  const newApplication = await prisma.application.create({
    data: {
      title: application.title,
      url: application.url,
      description: application.jobDescription,
      userId: user!.id,
      companyId: application.companyId,
      resumes: {
        connect: {
          id: application.resumeId
        }
      },
      currentResume: {
        connect: {
          id: application.resumeId
        }
      }
    },
  });

  return NextResponse.json({ application: newApplication });
}
