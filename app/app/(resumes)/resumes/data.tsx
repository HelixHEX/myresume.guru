"use client";
import ResumeCard from "@/components/resumes/cards";
import { useGetResumes } from "../lib/queries";
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

	return (
		<div className="w-full flex h-full flex-col">
			{resumes?.map((resume, i) => (
				<ResumeCard key={i} {...resume} />
			))}
		</div>
	);
}
