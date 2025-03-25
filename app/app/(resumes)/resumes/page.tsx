import FilterResumes from "@/components/resumes/filter";
import Resumes from "./data";
import UploadResumeBtn from "@/components/uploadResumeBtn";
import {
	HydrationBoundary,
	QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import {  getResumes } from "../lib/queries";

export default async function Page() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["resumes"],
		queryFn: getResumes,
	});

	return (
		<div className="p-4 px-0">
			<div className="flex px-8 flex-row h-12 justify-between sm:justify-start">
				<h1 className="text-2xl md:text-4xl mr-2 font-bold self-center text-black">
					My Resumes
				</h1>
				<UploadResumeBtn w={"w-[170px]"} />
			</div>
			{/* <div className="flex mb-8 w-auto pt-4">
        <FilterResumes />
      </div> */}
			<div className="mt-4" />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Resumes />
			</HydrationBoundary>
			{/* <Resumes /> */}
		</div>
	);
}
