import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
// export const GET = (request: Request, response: Response, {params: {fileKey: Resume['fileKey']}}) => {
//   const { fileKey } = request.json();;
// }
export const GET = async (
  request: Request,
  { params }: { params: { fileKey: Resume["fileKey"] } }
) => {
  const { fileKey } = params;

  const resume = await prisma.resume.findUnique({
    where: {
      fileKey,
    },
    include: {
      feedbacks: { include: { actionableFeedbacks: true } },
    },
  });

  if (!resume) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json({ resume });
};
