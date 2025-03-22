import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
// export const GET = (request: Request, response: Response, {params: {fileKey: Resume['fileKey']}}) => {
//   const { fileKey } = request.json();;
// }
export const GET = async (
  request: Request,
  props: { params: Promise<{ fileKey: Resume["fileKey"] }> }
) => {
  const params = await props.params;
  const { fileKey } = params;

  const resume = await prisma.resume.findUnique({
    where: {
      fileKey,
    },
    include: {
      feedbacks: { include: { actionableFeedbacks: true } },
      improvements: true,
    },
  });

  if (!resume) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json({ resume });
};
