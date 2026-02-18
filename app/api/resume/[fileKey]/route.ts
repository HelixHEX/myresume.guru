import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { type NextRequest, NextResponse } from "next/server";

function findResumeByIdOrFileKey(idOrFileKey: string) {
  const id = Number(idOrFileKey);
  if (Number.isInteger(id) && String(id) === idOrFileKey) {
    return prisma.resume.findUnique({ where: { id } });
  }
  return prisma.resume.findUnique({ where: { fileKey: idOrFileKey } });
}

export const GET = async (_request: NextRequest, props: { params: Promise<{ fileKey: string }> }) => {
  const params = await props.params;
  const { userId } = await auth();
  const { fileKey: idOrFileKeyParam } = params;

  const base = await findResumeByIdOrFileKey(idOrFileKeyParam);
  const fullResume = base
    ? await prisma.resume.findUnique({
        where: { id: base.id },
        include: {
          feedbacks: { include: { actionableFeedbacks: true } },
          improvements: true,
        },
      })
    : null;

  if (!fullResume) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }

  if (process.env.NODE_ENV === "production" && fullResume.userId !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!fullResume.v2Conversion && !fullResume.v2Started) {
    tasks.trigger("analyze-resume", {
      resumeId: fullResume.id,
      userId: userId!,
      FREE_GEN: true,
    });
  }

  return NextResponse.json({ resume: fullResume });
};

export const PATCH = async (
  request: NextRequest,
  props: { params: Promise<{ fileKey: string }> }
) => {
  const params = await props.params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { fileKey: idOrFileKeyParam } = params;
  const resume = await findResumeByIdOrFileKey(idOrFileKeyParam);

  if (!resume) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }

  if (resume.userId !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: { pinned?: boolean; name?: string; tags?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const data: { pinned?: boolean; name?: string; tags?: string[] } = {};
  if (typeof body.pinned === "boolean") data.pinned = body.pinned;
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (Array.isArray(body.tags)) {
    data.tags = body.tags.filter(
      (t): t is string => typeof t === "string" && t.trim().length > 0
    ).map((t) => t.trim());
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ resume });
  }

  const updated = await prisma.resume.update({
    where: { id: resume.id },
    data,
  });

  return NextResponse.json({ resume: updated });
};
