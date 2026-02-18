import Resumes from "./data";
import AddResumeTooltip from "@/components/resumes/AddResumeTooltip";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { getResumes } from "../lib/queries";

export default async function Page() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["resumes"],
		queryFn: getResumes,
	});

	return (
		<div className="mb-[24px]">
			<div className="flex p-8 flex-row h-12 justify-between sm:justify-start">
				<h1 className="text-2xl md:text-4xl mr-2 font-bold self-center text-blue-800">
					My Resumes
				</h1>
				<AddResumeTooltip />
			</div>
			<div className="mt-4" />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Resumes />
			</HydrationBoundary>
		</div>
	);
}
