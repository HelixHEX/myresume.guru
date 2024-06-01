import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId") ?? ""
  const applications = await prisma.application.findMany({
    where: {
      companyId: parseInt(companyId),
    },
  });

  return NextResponse.json({applications})
}

// export async function POST(R)