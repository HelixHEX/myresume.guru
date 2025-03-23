"use client";

import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { context } from "@/lib/context";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startResumeAnalysis } from "@/lib/actions/resume";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function StreamFeedback() {
	const currentUser = useUser();
	const { resume, setStatus, setRefetchInterval } = useContext(
		context.resume.ResumeContext,
	);
	useEffect(() => {
		if (resume?.status === "Analyzing") {
			toast.info("Analysis started! This may take a minute or two.");
		} else if (resume?.status === "Limit Reached") {
			toast.error("Daily Limit Reached");
			setRefetchInterval(0)
		}
	}, [resume, setRefetchInterval]);

	const handleGenerateFeedback = async () => {
		if (!resume) return;

		try {
			const result = await startResumeAnalysis(
				resume.fileKey,
				currentUser?.user?.id!,
			);
			setRefetchInterval(2000);
			if (!result.success) {
				toast.error(result.error as string);
				setRefetchInterval(0)
			} else {
				toast.success("Analysis started! This may take a minute or two.");
			}
		} catch (error) {
			console.error("Error starting analysis:", error);
			toast.error("Failed to start analysis. Please try again.");
			setStatus("idle");
		}
	};

	return (
		<div className="flex justify-start mb-6">
			<Button
				onClick={handleGenerateFeedback}
				disabled={
					!resume || status === "analyzing" || resume.status === "Limit Reached"
				}
				className="h-[34px] "
			>
				{resume?.status === "Analyzing" ||
				resume?.status === "JSON Generated" ? (
					<>
						Analyzing
						<Loader2 className="ml-2 h-4 w-4 animate-spin" />
					</>
				) : resume?.status === "Limit Reached" ? (
					"Daily Limit Reached"
				) : (
					"Generate Feedback"
				)}
			</Button>
			{resume?.status === "Limit Reached" && (
				<Link href="/plans" className="text-sm font-bold hover:text-blue-800 self-center ml-2 text-dark-gray">
					Upgrade Plan
				</Link>
			)}
		</div>
	);
}
