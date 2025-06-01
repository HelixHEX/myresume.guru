import { api } from "@/lib/api";

import AIProvider from "@/lib/providers/ai";
import ResumeDetails from "./data";
import { getChat, getMessagesFromDB } from "@/lib/actions/chat";
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PDFPreview from "../../_components/editor/preview";
import Editor from "../../_components/editor";

export default async function Page(props: {
	params: Promise<{ resumeId: string }>;
}) {
	const params = await props.params;
	const chat = await getChat(params.resumeId);
	//biome-ignore lint:
	const messages = chat ? await getMessagesFromDB(chat) : ([] as any[]);
	return (
		<>
			<Tabs defaultValue='feedback' className="w-full">
				<TabsList className="bg-white rounded-none w-full">
					<TabsTrigger
						className="cursor-pointer text-blue-800 transition-all duration-800 font-bold text-md group data-[state=active]:text-white data-[state=active]:bg-blue-800 bg-white rounded-none border-none"
						value="edit-resume"

					>
						<p className="group-hover:translate-y-[-5px] transition-all duration-800">Edit Resume</p>
					</TabsTrigger>
					<TabsTrigger
						className="cursor-pointer text-blue-800 transition-all duration-800 font-bold text-md data-[state=active]:text-white group data-[state=active]:bg-blue-800 bg-white rounded-none border-none"
						value="feedback"
					>
						<p className="group-hover:translate-y-[-5px] transition-all duration-800">Feedback</p>
					</TabsTrigger>
				</TabsList>
				<div className="w-full bg-white -mt-[8px] h-[1px]" />
				<div className="flex bg-white w-full flex-col md:flex-row">
					<TabsContent className="-mt-2 w-full " value="edit-resume">
						<div className="p-4 md:px-8 flex w-full md:w-[400px]  h-full">
							<div className="w-full ">
								<h1 className=" text-4xl font-bold text-blue-800 ">
									Edit Resume
								</h1>
								<Editor resumeId={params.resumeId} />
							</div>
						</div>
					</TabsContent>
					<TabsContent
						className="-mt-2 w-full h-full"
						value="feedback"
					>
						<div className="md:px-8  p-4 flex-col flex w-[400px] h-full">
							<h1 className=" text-4xl font-bold text-blue-800">
								Suggested Improvements
							</h1>
							<div className="mt-8 md:mt-0 w-full flex flex-col">
								<p className="mt-2 text-gray-400 text-md font-bold w-full">
									Get specific, actionable feedback on how to improve your
									resume. The Al will highlight areas for improvement and
									provide clear recommendations to help you make your resume
									stand out for your next job application.
								</p>
							</div>
							<ResumeDetails resumeId={params.resumeId} />
						</div>
					</TabsContent>
					<div className=" bg-gray-50 w-full">
						<PDFPreview resumeId={params.resumeId} />
					</div>
				</div>
			</Tabs>
			{/* biome-ignore lint: */}
			<AIProvider chatId={chat!} messages={messages}>
				<AssistantModal />
			</AIProvider>
		</>
	);
}
