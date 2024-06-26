import { AI } from "@/actions";
import Feedback from "@/components/resumes/feedback";
import ResumeName from "@/components/resumes/resumeName";
import { AssistantModal } from "@/components/ui/assistant-ui/assistant-modal";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <h1 className=" text-4xl font-light text-black">Improve your resume</h1>
      <div className="mt-8 md:mt-0 w-full flex flex-col">
        <p className="text-gray-400">
          Get specific, actionable feedback on how to improve your resume. The
          Al will highlight areas for improvement and provide clear
          recommendations to help you make your resume stand out for your next
          job application.
        </p>
      </div>
      <div className="mt-8 flex w-full flex-col md:flex-row justify-between">
        <ResumeName />
        <Image
          className="bg-none mt-8 md:mt-0 ml-[-40px]"
          height={100}
          width={300}
          src="/images/resume.jpg"
          alt=""
        />
      </div>
      <h2 className="mt-44 font-bold text-2xl">Suggested Improvements</h2>
      <p className="mt-4 mb-8">
        {"We've used AI to help you improve your resume!"}
      </p>
      <Feedback />
      {/* <AssistantModal /> */}
    </>
  );
}
