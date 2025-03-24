import { context } from "@/lib/context";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { useAssistantModalOpenState } from "../assistant-ui/assistant-modal";
import { Sparkles } from "lucide-react";

export default function ResumeName() {
	const { resume } = useContext(context.resume.ResumeContext);
	const [_open, setOpen] = useAssistantModalOpenState({defaultOpen: false});

	return (
		<div className="">
			<>
				<p className="w-auto  underline text-gray-400">{resume?.name}</p>
				<Button
					onClick={() => setOpen(true)}
					className="mt-2 w-full h-8"
				>
					Get help with your resume
					<Sparkles height={18} className="ml-2" width={18} />
				</Button>
			</>
		</div>
	);
}
