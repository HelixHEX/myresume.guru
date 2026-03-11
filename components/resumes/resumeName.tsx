import { context } from "@/lib/context";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

export default function ResumeName() {
	const { resume } = useContext(context.resume.ResumeContext);
	const router = useRouter();

	const handleGetHelp = () => {
		const fileKey = (resume as { fileKey?: string } | null)?.fileKey;
		if (fileKey) {
			router.push(`/app/resumes/${fileKey}?tab=edit-resume&mode=ai`);
		} else {
			router.push("/app/chat");
		}
	};

	return (
		<div className="">
			<>
				<p className="w-auto  underline text-gray-400">{resume?.name}</p>
				<Button
					onClick={handleGetHelp}
					className="mt-2 w-full h-8"
					aria-label="Get help with your resume"
				>
					Get help with your resume
					<Sparkles height={18} className="ml-2" width={18} />
				</Button>
			</>
		</div>
	);
}
