import { NextRequest, NextResponse } from "next/server";
// file structure is /app/api/companies/[companyId]/route.ts
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(_request: Request, {params}: {params: {id: string}}) {
  const companyId = params.id;
  const company = await prisma.company.findUnique({
    where: {
      id: parseInt(companyId),
    },
    include: {
      applications: true
    }
  });

  if (!company) {
    return NextResponse.json({message: "Company not found"});
  }

  return NextResponse.json({ company });
}
