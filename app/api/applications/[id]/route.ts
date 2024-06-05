import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const application = await prisma.application.findUnique({
    where: {
      id: id ? parseInt(id) : undefined,
    },
  });

  return NextResponse.json({ application });
}
