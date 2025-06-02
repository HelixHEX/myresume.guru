"use client";

import { saveMessage } from "@/lib/actions/chat";
import {
	type AppendMessage,
	AssistantRuntimeProvider,
	useAssistantInstructions,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function AIProvider({
	children,
	messages,
	chatId
	//biome-ignore lint:
}: { children: React.ReactNode; messages: any[]; chatId: number	 }) {
	const queryClient = useQueryClient();
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
				// After saving the message, start polling for resume updates
				const pollInterval = setInterval(async () => {
					await queryClient.invalidateQueries({ queryKey: ["resume"] });
				}, 2000); // Poll every 2 seconds

				// Stop polling after 10 seconds
				setTimeout(() => {
					clearInterval(pollInterval);
				}, 10000);
			}
		}
	});

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	);
}
