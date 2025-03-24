"use client";

import ApplicationCard from "@/components/applications/cards";
import CreateApplicationCard from "@/components/applications/cards/create";
import { useGetApplications } from "@/lib/api/queries/applications";
import { Loader2 } from "lucide-react";

export default function Applications() {
	const { data, status } = useGetApplications();

	if (status === "pending") {
		return (
			<div className="flex items-center justify-center w-full">
				<div className="text-gray-800">Loading</div>
				<Loader2 className="ml-2 animate-spin text-gray-800" />
			</div>
		);
	}

	if (status === "error") {
		return <div>Error</div>;
	}

	if (data.message) {
		return <div>{data.message}</div>;
	}

	const calcScore = ({ scores }: { scores: ApplicationScore[] }) => {
		let total = 0;
		if (scores.length > 0) {
			scores.forEach((score) => {
				if (!isNaN(score.score)) {
					total += score.score;
				}

				console.log(isNaN(score.score));
			});
			// console.log()
			return Math.round(total / scores.length);
		}
		return 0;
		// return total;
	};
	return (
		<>
			{data.applications.length > 0 ? (
				<div className="h-full w-full  mt-4 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
					<CreateApplicationCard />
					{data.applications.map((application, index) => (
						<ApplicationCard
							score={calcScore({ scores: application.applicationScores! })}
							key={index}
							title={application.title}
							id={application.id}
							company={application.company?.name}
							// applications={application.applications!.length}
						/>
					))}
				</div>
			) : (
				<div className="mt-4">
					<CreateApplicationCard />
				</div>
			)}
		</>
	);
}
