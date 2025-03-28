"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
	id: string;
	title: string;
	score: number;
	company?: string;
};

export default function ApplicationCard({ id, title, company, score }: Props) {
	const router = useRouter();
	return (
		<Card className="w-full flex items-center h-auto  min-h-[100px]">
			<CardContent className="flex mt-6 justify-between flex-row h-full w-full self-center relative items-center">
				<h2 className="text-md font-medium">{title}</h2>
				<Button
					onClick={() => router.push(`/app/applications/${id}`)}
					className="bg-white hover:cursor-pointer self-center rounded-full text-blue-800 text-xl hover:bg-blue-800 hover:border-blue-800 hover:text-white w-12 h-12 border-2 border-gray-300"
				>
					<MoveRight />
				</Button>
			</CardContent>
		</Card>
	);
}
