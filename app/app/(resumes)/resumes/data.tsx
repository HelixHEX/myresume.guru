"use client";
import ResumeCard from "@/components/resumes/cards";
import { useGetResumes } from "../lib/queries";
import { Loader2 } from "lucide-react";
export default function Resumes() {
	const { data: resumes, isLoading, isError } = useGetResumes();

	if (isError) {
		return (
			<div className="text-center mt-4 text-red-400">
				{/* <context.resume.ChangeTitle title="" /> */}
				An error occurred while loading your resumes
			</div>
		);
	}

	if ((!resumes && !isLoading) || resumes?.length === 0) {
		return (
			<div className="text-center mt-4 text-gray-400">
				{
					"You don't have any resumes yet. Click the button above to upload your first resume."
				}
			</div>
		);
	}
 
	if (isLoading) {
		return ( 
			<div className="flex items-center justify-center w-full">
				<div className="text-gray-800">Loading</div>
				<Loader2 className="ml-2 animate-spin text-gray-800" />
			</div>
		);
	}
	return (
		<div className="w-full flex h-full flex-col">
			{resumes?.map((resume, i) => (
				<ResumeCard key={i} {...resume} />
			))}
		</div>
	);
}
