import { NextResponse, type NextRequest } from "next/server";
// file structure is /app/api/companies/[companyId]/route.ts
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")
  const company = await prisma.company.findUnique({
    where: {
      id: id ? Number.parseInt(id) : undefined,
    },
    include: {
      applications: { include: { applicationScores: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!company) {
    return NextResponse.json({ message: "Company not found" });
  }

  return NextResponse.json({ company });
}
