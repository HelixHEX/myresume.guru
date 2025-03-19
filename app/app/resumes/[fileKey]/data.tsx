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
	const { resume } = useContext(context.resume.ResumeContext);

	// if (resume?.status === "Analyzing") return null;

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
			{resume.status === "Analyzed" ? <Feedback /> : <StreamFeedback />}
			<AssistantModal />
		</>
	);
}
