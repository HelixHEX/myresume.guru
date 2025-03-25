import { Download } from "lucide-react";
import Editor from "../../_components/editor";
import PDFPreview from "../../_components/editor/preview";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import DownloadResume from "../../_components/downloadResume";

export default function NewResumePage() {
	return (
		<div className="w-full flex h-full">
			<div className="h-full p-4 px-4 sm:px-8 transition-all duration-300 w-full lg:w-[700px] bg-white sm:bg-blue-800">
				<div className="flex gap-2">
					<h1 className=" text-4xl font-bold text-blue-800 sm:text-white">
						New Resume
					</h1>
				</div>
				<Editor resumeId={""} />
			</div>
			<div className="hidden bg-[#F6F6F6] w-full md:flex">
				<PDFPreview />
			</div>
		</div>
	);
}
