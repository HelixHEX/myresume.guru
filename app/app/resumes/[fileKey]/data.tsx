"use client";
import Feedback from "@/components/resumes/feedback";
import ResumeName from "@/components/resumes/resumeName";
import { api } from "@/lib/api";
import { context } from "@/lib/context";
import Image from "next/image";
import { useContext, useEffect } from "react";
import StreamFeedback from "@/components/resumes/streamFeedback";
import { AssistantModal } from "@/components/ui/assistant-ui/assistant-modal";

export default function ResumeDetails({
  fileKey,
}: {
  fileKey: Resume["fileKey"];
}) {
  const { resume,feedbacks,  status } = useContext(context.resume.ResumeContext);

  useEffect(() => {
   console.log(resume)
  }, [resume]);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (!resume) {
    return <div>Resume not found</div>;
  }

  return (
    <>
      <div className="mt-8 flex w-full flex-col md:flex-row justify-between">
        <ResumeName />
        {/* <Image
          className="bg-none mt-8 md:mt-0 ml-[-40px]"
          height={100}
          width={300}
          src="/images/resume.jpg"
          alt=""
        /> */}
      </div>
      <h2 className="mt-20 font-bold text-2xl">Suggested Improvements</h2>
      <p className="mt-4 mb-8">
        {"We've used AI to help you improve your resume!"}
      </p>
      {resume.improvements && resume.improvements.length > 0 ? (
        <Feedback />
      ) : (
        <StreamFeedback />
      )}
      <AssistantModal />
    </>
  );
}

// export const LoadResume = ({
//   id,
//   children,
// }: {
//   id: string;
//   children: React.ReactNode;
// }) => {
//   const { data, status } = api.queries.resume.useGetResume(id);

//   if (status === "pending")
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   return <>{children}</>;
// };
