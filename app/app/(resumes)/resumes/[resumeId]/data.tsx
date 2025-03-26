"use client";

import { useEffect, useState } from "react";
import { useGetResume } from "../../lib/queries";
import { Button } from "@/components/ui/button";
import ImprovementCard from "@/components/resumes/cards/improvement";
import { startResumeAnalysis } from "@/lib/actions/resume";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";

export default function ResumeDetails({
	resumeId,
}: {
	resumeId: string;
}) {
	const router = useRouter();
	const { user } = useUser();
	const [refetchInterval, setRefetchInterval] = useState(0);
	const { data: resumeData, isLoading } = useGetResume(
		resumeId.toString(),
		refetchInterval,
	);
	const resume = resumeData?.resume;
	useEffect(() => {
		if (resume) {
			if (resume.status === "Limit Reached") {
				toast.error(
					"You have reached the daily limit of resumes you can get feedback on. Please upgrade to continue.",
				);
				setRefetchInterval(0);
			} else if (resume.status === "Analyzed") {
				setRefetchInterval(0);
			} else if (resume.status !== "Analyzed") {
				setRefetchInterval(1000);
			}
		}
	}, [resume]);

	const handleGenerateFeed = async () => {
		//biome-ignore lint:
		const result = await startResumeAnalysis(resume?.fileKey!, user!.id);
		setRefetchInterval(1000);
		if (!result.success) {
			toast.error(result.error as string);
			setRefetchInterval(0);
		} else {
			toast.success("Analysis started! This only takes 30 seconds");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full">
				<div className="text-gray-800">Loading...</div>
				<Loader2 className="ml-2 animate-spin text-gray-800" />
			</div>
		);
	}
	return (
		<>
			<div className="py-4 flex flex-col gap-2">
				{(resume?.status === "Not Started" ||
					resume?.status === "Not Analyzed" ||
					resume?.status === "Limit Reach") &&
					!isLoading && (
						<Button className="w-fit rounded-none text-blue-800 hover:bg-gray-200 cursor-pointer mb-4 bg-white" onClick={() => handleGenerateFeed()}>
							Generate Feedback
						</Button>
					)}


				{resume?.status === "Limit Reached" && !isLoading && (
					<Alert variant="destructive" className="w-[400px]">
						<Info className="h-4 w-4]" />

						<AlertDescription className="flex flex-col">
							<p className="font-bold">
								You have reached the daily limit of feedbacks you can generate.
								Please{" "}
								<span
									onClick={() => router.push("/plans")}
									className=" text-blue-800 underline w-auto hover:cursor-pointer"
								>
									upgrade
								</span>{" "}
								to continue.
							</p>
						</AlertDescription>
					</Alert>
				)}
				{(resume?.status.includes("Analyzing") ||
					resume?.status.includes("Generating")) && (
					<p className="text-blue-800 font-bold">{resume.status}...</p>
				)}
			</div>

			<div className="flex flex-col mt-4">
				{resume?.improvements?.map((improvement, index) => (
					<ImprovementCard key={index} {...improvement} />
				))}
			</div>
		</>
	);
}
