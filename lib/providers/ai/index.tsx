"use client";

import { saveMessage } from "@/lib/actions/chat";
import {
	type AppendMessage,
	AssistantRuntimeProvider,
	useAssistantInstructions,
} from "@assistant-ui/react";

import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

export default function AIProvider({
	children,
	messages,
	chatId
	//biome-ignore lint:
}: { children: React.ReactNode; messages: any[]; chatId: number	 }) {
	const runtime = useChatRuntime({
		body: {
			chatId
		},
		api: "/api/ai/chat",
		initialMessages: messages,
		onFinish: async (message) => {
			const contentPart = message.content[0];
			if (contentPart && 'text' in contentPart) {
				await saveMessage(contentPart.text, chatId, "assistant");
			}
		}
	});



	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	);
}
