"use client";

import ResumeName from "@/components/resumes/resumeName";
import {  useEffect, useState } from "react";
import { useGetResume } from "../../lib/queries";
import { Button } from "@/components/ui/button";
import ImprovementCard from "@/components/resumes/cards/improvement";
import { startResumeAnalysis } from "@/lib/actions/resume";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

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
