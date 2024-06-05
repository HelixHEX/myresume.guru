import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const applications = await prisma.application.findMany({
    where: {
      id: id ? parseInt(id) : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications });
}
