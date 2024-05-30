"use client";

import Feedback from "@/components/resumes/feedback";
import { context } from "@/lib/context";
import Image from "next/image";
import { useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [status, setStatus] = useState<"Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database">(
    "Loading"
  );
  return (
    <>
      <context.resume.ChangeTitle title="Improve your resume" />
      <div className="p-4 md:p-0 w-full flex flex-col">
        <p className="text-gray-400">
          Get specific, actionable feedback on how to improve your resume. The
          Al will highlight areas for improvement and provide clear
          recommendations to help you make your resume stand out for your next
          job application.
        </p>

        <div className="mt-8 flex flex-col md:flex-row justify-betwee">
          <div className="w-full self-center">
            <p className="hover:cursor-pointer hover:text-gray-500 underline text-gray-400">
              EliasWambuguResume.pdf
            </p>
            <p className="font-bold">
              {status === "Done" ? "Your feedback is ready!" : status + "..."}
            </p>
          </div>
          <Image
            className="bg-none"
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
        <Feedback status={status} setStatus={setStatus} slug={slug} />
      </div>
    </>
  );
}
