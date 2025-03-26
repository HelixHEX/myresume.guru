import { api } from "@/lib/api";

import AIProvider from "@/lib/providers/ai";
import ResumeDetails from "./data";
import { getChat, getMessagesFromDB } from "@/lib/actions/chat";
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";

export default async function Page(props: {
	params: Promise<{ fileKey: string }>;
}) {
	const params = await props.params;
	const chat = await getChat(params.fileKey);
	//biome-ignore lint:
	const messages = chat ? await getMessagesFromDB(chat) : ([] as any[]);
	return (
		<>
			<div className="p-4 px-8 bg-blue-800">
				<h1 className=" text-4xl font-bold text-white">Suggested Improvements</h1>
				<div className="mt-8 md:mt-0 w-full flex flex-col">
					<p className="mt-2 text-gray-50 text-md font-bold w-full md:w-3/5">
						Get specific, actionable feedback on how to improve your resume. The
						Al will highlight areas for improvement and provide clear
						recommendations to help you make your resume stand out for your next
						job application.
					</p>
				</div>
			</div>
			{/* biome-ignore lint: */}
			<AIProvider chatId={chat!} messages={messages}>
				<ResumeDetails fileKey={params.fileKey} />
				<AssistantModal />
			</AIProvider>
		</>
	);
}
