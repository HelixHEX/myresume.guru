"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetResumeEditorData } from "../lib/queries";
export default function SaveResume({ className }: { className?: string }) {
	const { data: resume, isPending } = useGetResumeEditorData("");


	return (
		<Button
			disabled={!resume || isPending}
			type="submit"
			className={cn(
				"bg-blue-800 rounded-none md:bg-white md:text-blue-800 md:hover:bg-gray-300 md:hover:text-blue-800 text-white hover:bg-blue-900 font-bold cursor-pointer",
				className
			)}
		>
			Save
		</Button>
	);
}
