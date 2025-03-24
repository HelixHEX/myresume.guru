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
import { Info } from "lucide-react";

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
			} else if (resume.status === "JSON Generated") {
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
			toast.success("Analysis started! This may take a minute or two.");
		}
	};
	return (
		<>
			<div className="p-4 flex flex-col gap-2">
				<Link
					href={`${process.env.NEXT_PUBLIC_UPLOAD_THING_FILE_URL}/${resume?.fileKey}`}
					className="text-[#373737] text-lg hover:underline hover:text-blue-800 font-bold"
				>
					{resume?.name}
				</Link>
				{/* {resume?.status !== "Analyzed" && !isLoading && (
					<Button
						disabled={resume?.status === "Limit Reached" || isLoading}
						className="w-fit mb-4"
						onClick={() => handleGenerateFeed()}
					>
						{resume?.status === "Not Started"
							? "Generate Feedback"
							: resume?.status === "JSON Generated" && resume?.status}
					</Button>
				)} */}
				{resume?.status === "Not Started" && !isLoading && (
					<Button className="w-fit mb-4" onClick={() => handleGenerateFeed()}>
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
								<span onClick={() => router.push("/plans")} className=" text-blue-800 underline w-auto hover:cursor-pointer">
									upgrade
								</span>{" "}
								to continue.
							</p>
						</AlertDescription>
					</Alert>
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
