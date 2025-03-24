"use client";

import ResumeName from "@/components/resumes/resumeName";
import { useEffect, useState } from "react";
import { useGetResume } from "../../lib/queries";
import { Button } from "@/components/ui/button";
import ImprovementCard from "@/components/resumes/cards/improvement";
import { startResumeAnalysis } from "@/lib/actions/resume";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResumeDetails({
	fileKey,
}: {
	fileKey: Resume["fileKey"];
}) {
	const router = useRouter();
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
			<div className="p-4">
				<Link
					href={`${process.env.NEXT_PUBLIC_UPLOAD_THING_FILE_URL}/${resume?.fileKey}`}
					className="text-[#373737] text-lg hover:underline hover:text-blue-800 font-bold"
				>
					{resume?.name}
				</Link>
				{resume?.status !== "Analyzed" && !isLoading && (
					<Button
						disabled={resume?.status === "Limit Reached" || isLoading}
						className="w-fit mb-4"
						onClick={() => handleGenerateFeed()}
					>
						{resume?.status === "Not Started" ||
						resume?.status === "Limit Reeched"
							? "Generate Feedback"
							: resume?.status}
					</Button>
				)}
			</div>

			<div className="flex flex-col mt-4">
				{resume?.improvements?.map((improvement, index) => (
					<ImprovementCard key={index} {...improvement} />
				))}
			</div>
			{/* <AssistantModal fileKey={fileKey} /> */}
		</>
	);
}
