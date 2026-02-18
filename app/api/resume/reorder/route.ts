import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: { orderedIds?: number[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const orderedIds = body.orderedIds;
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json(
      { message: "orderedIds must be a non-empty array" },
      { status: 400 }
    );
  }

  const ids = orderedIds.filter(
    (id): id is number => typeof id === "number" && Number.isInteger(id)
  );

  const resumes = await prisma.resume.findMany({
    where: { id: { in: ids }, userId },
    select: { id: true },
  });

  if (resumes.length !== ids.length) {
    return NextResponse.json(
      { message: "Some resume ids not found or unauthorized" },
      { status: 400 }
    );
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.resume.update({
        where: { id },
        data: { position: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
