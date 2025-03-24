"use client";

import { useContext } from "react";
import { Badge } from "../ui/badge";
import { context } from "@/lib/context";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useUpdateApplication } from "@/lib/api/mutations/applications";
import { useGetApplication } from "@/lib/api/queries/applications";

export default function ApplicationTitle({ id }: { id: string }) {
	const { data: applicationData, status: applicationStatus } =
		useGetApplication(id);
	const { mutate, isPending } = useUpdateApplication();

	const handleUpdate = (e: string) => {
		mutate({ ...application, status: e } as Application);
	};

	if (!applicationData || !applicationData) return null;
	const application = applicationData.application;
	return (
		<div className="flex mt-[-6px] ">
			<h1 className="self-center w-full md:w-[500px] font-bold  text-2xl text-black">
				{status === "Loading" && !application
					? "Loading..."
					: application?.title}
			</h1>
			{/* <Badge className="ml-2  self-center">Active</Badge> */}
			<Select onValueChange={handleUpdate} disabled={isPending}>
				<SelectTrigger className="w-[120px] ml-2 h-[40px]">
					<SelectValue placeholder={application?.status} />
				</SelectTrigger>
				<SelectContent defaultValue={application?.status.toString()}>
					<SelectItem value="Active">Active</SelectItem>
					<SelectItem value="Pending">Pending</SelectItem>
					<SelectItem value="Denied">Denied</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
