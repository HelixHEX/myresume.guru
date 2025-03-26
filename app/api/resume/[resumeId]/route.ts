import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
// export const GET = (request: Request, response: Response, {params: {fileKey: Resume['fileKey']}}) => {
//   const { fileKey } = request.json();;
// }
export const GET = async (_request: NextRequest, props: { params: Promise<{ resumeId: string }> }) => {
  const params = await props.params;

  const { userId } = await auth();
  const { resumeId } = params;
  
  console.log(params)
  const resume = await prisma.resume.findUnique({
    where: {
      id: Number.parseInt(resumeId),
    },
    include: {
      feedbacks: { include: { actionableFeedbacks: true } },
      improvements: true,
    },
  });

  if (!resume) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }

  if (resume.userId !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ resume });
};
