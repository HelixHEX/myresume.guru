import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const companies = await prisma.company.findMany({
    include: { applications: true },
  });
  return NextResponse.json({companies});
}

export async function POST(req: NextRequest) {
  const user = await currentUser();

  const { name, website } = await req.json();

  await prisma.company.create({
    data: {
      name,
      website,
      userId: user!.id,
    },
  });

  return NextResponse.json({ success: true });
}
