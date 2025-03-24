"use client";

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
	});



	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	);
}
