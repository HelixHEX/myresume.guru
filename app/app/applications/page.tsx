import ApplicationCard from "@/components/applications/cards/create";
import CompanyCard from "@/components/companies/cards";
import Applications from "./data";

export default function Page() {
	return (
		<div className=" flex  flex-col w-full h-full ">
			<div className="flex px-8 p-4 flex-col">
				<h1 className="mt-[-6px] text-4xl font-bold text-blue-800">
					Job Applications
				</h1>
				<p className="text-gray-400 font-bold text-md">
					{"Keep track of the status for each application "}
				</p>
			</div>
			<div className="p-8">
				<Applications />
			</div>
		</div>
	);
}
