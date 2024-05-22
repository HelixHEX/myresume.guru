import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export default async function GET({}: NextRequest) {
  const user = await currentUser();

  if (!user) return;

  const resumes = prisma.resume.findMany({where: {userId: user.id}});
  
  return NextResponse.json(resumes);
}