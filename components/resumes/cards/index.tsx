"use client";

import { MoveRight } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { FcCalendar } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function ResumeCard({ name, id, createdAt }: Resume) {
	const router = useRouter();

	const formattedDate = new Date(createdAt).toLocaleDateString();
	const time = new Date(createdAt).toLocaleTimeString();
	const formattedTime =
		time.substring(0, time.length - 6) +
		" " +
		time.slice(time.length - 2, time.length);
	return (
		<Card
			onClick={() => router.push(`/app/resumes/${id}`)}
			className="w-full hover:bg-blue-800 group hover:text-white hover:cursor-pointer flex flex-row p-0 h-[50px] rounded-none border-t-[0.02px] border-x-0 border-b-[0.02px] border-gray-200"
		>
			<CardHeader className="flex flex-col h-full px-4 justify-center p-0">
				<h2 className="text-sm px-4  font-medium">{name}</h2>
			</CardHeader>
			<CardContent className="h-full w-full pt-3 flex-col flex items-end">
				<div className="flex gap-2  h-full   flex-row justify-end">
					<p className="text-sm text-gray-500 group-hover:text-white">
						{formattedDate}
					</p>
					<p className="text-sm text-gray-500 group-hover:text-white">
						{formattedTime}
					</p>
					{/* <Button
            onClick={() => router.push(`/app/resumes/${fileKey}`)}
            className="bg-white rounded-full text-black text-xl hover:bg-gray-800 hover:border-gray-800 hover:text-white w-10 h-10 border-2 border-black"
          >
          </Button> */}
				</div>
			</CardContent>
		</Card>
	);
}
