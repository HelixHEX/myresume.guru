"use client";
import Feedback from "@/components/resumes/feedback";
import ResumeName from "@/components/resumes/resumeName";
import { api } from "@/lib/api";
import { context } from "@/lib/context";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import StreamFeedback from "@/components/resumes/streamFeedback";
import { AssistantModal } from "@/components/ui/assistant-ui/assistant-modal";
import { useGetResume } from "../../lib/queries";
import { Button } from "@/components/ui/button";
import ImprovementCard from "@/components/resumes/cards/improvement";
import { useGenerateFeedback } from "../../lib/mutations";
import { startResumeAnalysis } from "@/lib/actions/resume";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useAssistantInstructions } from "@assistant-ui/react";

export default function ResumeDetails({
	fileKey,
}: {
	fileKey: Resume["fileKey"];
}) {
	const { user } = useUser();
	const [refetchInterval, setRefetchInterval] = useState(0);
	const { data: resumeData, isLoading } = useGetResume(
		fileKey,
		refetchInterval,
	);

	useAssistantInstructions({
		instruction: `You are a resume guru assistan. Here is the resume text and improvements that have already been recommended. Resume: ${resumeData?.resume?.text} Improvements: ${resumeData?.resume?.improvements?.map((improvement) => `${improvement.title}: ${improvement.text}`).join(", ")}`,
	});
	const resume = resumeData?.resume;
	useEffect(() => {
		if (resume) {
			if (resume.status === "Limit Reached") {
				toast.error(
					"You have reached the daily limit of resumes you can get feedback on. Please upgrade to continue.",
				);
			}
		}
	}, [resume]);
	const handleGenerateFeed = async () => {
		const result = await startResumeAnalysis(resume?.fileKey!, user!.id);
		setRefetchInterval(1000);
		if (!result.success) {
			toast.error(result.error as string);
			setRefetchInterval(0);
		} else {
			toast.success("Analysis started! This may take a minute or two.");
		}
	};
	return (
		<>
			<div className="px-4">
				<div className="mt-8 flex w-full flex-col md:flex-row justify-between">
					<ResumeName />
				</div>
				<h2 className="mt-20 font-bold mb-2 text-2xl">
					Suggested Improvements
				</h2>
				<Button
					disabled={
						resume?.status === "Limit Reached" ||
						resume?.status === "Analyzed" ||
						isLoading
					}
					className="w-fit mb-4"
					onClick={() => handleGenerateFeed()}
				>
					{resume?.status === "Not Started"
						? "Generate Feedback"
						: resume?.status === "Analyzing"
							? "Analyzing..."
							: isLoading
								? "Loading..."
								: "Analyzed"}
				</Button>
			</div>

			<div className="flex flex-col">
				{resume?.improvements?.map((improvement, index) => (
					<ImprovementCard key={index} {...improvement} />
				))}
			</div>
			{/* <AssistantModal fileKey={fileKey} /> */}
		</>
	);
}
