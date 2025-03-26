import Editor from "../../_components/editor";
import PDFPreview from "../../_components/editor/preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SaveResume from "../../_components/save-resume";

export default function NewResumePage() {
	return (
		<div className="w-full flex flex-col h-full">
			<div className="flex h-full">
				<div className="h-full p-4 px-4 sm:px-8 transition-all duration-300 w-full lg:w-[700px] md:bg-blue-800">
					<div className="flex w-full gap-2">
						<div className="md:hidden  w-full pt-4">
							<Tabs defaultValue="edit" className="w-full">
								<div className="flex gap-4">
									<h1 className=" text-4xl font-bold text-blue-800">
										New Resume
									</h1>
									<TabsList className="self-center">
										<TabsTrigger
											className="cursor-pointer text-blue-800 data-[state=active]:text-white data-[state=active]:bg-blue-800 bg-white rounded-none border-none"
											value="edit"
										>
											Edit
										</TabsTrigger>
										<TabsTrigger
											className="cursor-pointer text-blue-800 data-[state=active]:bg-blue-800 bg-white data-[state=active]:text-white rounded-none border-none"
											value="preview"
										>
											Preview
										</TabsTrigger>
									</TabsList>
								</div>
								<TabsContent value="edit">
									<Editor resumeId={""} />
								</TabsContent>
								<TabsContent className="w-full md:flex" value="preview">
									<PDFPreview />
								</TabsContent>
							</Tabs>
						</div>
					</div>
					<div className="hidden md:block">
						<h1 className=" text-4xl font-bold text-white">New Resume</h1>
						<Editor resumeId={""} />
					</div>
				</div>
				<div className="hidden bg-gray-50 w-full md:flex">
					<PDFPreview />
				</div>
			</div>
		</div>
	);
}
