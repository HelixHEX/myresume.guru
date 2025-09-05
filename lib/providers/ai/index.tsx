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
	// const runtime = useChatRuntime({
	// 	api: "/api/ai/chat",
	// 	initialMessages: messages,
	// 	onFinish: async (message) => {
  //     console.log("message-finish: ", message);

  //     // Find the text content in the message
  //     const textContent = message.content.find(
  //       (content) => content.type === "text"
  //     );

  //     if (textContent && "text" in textContent) {
  //       await saveMessage(textContent.text, "assistant");
  //     }
  //   },
	// });
	const runtime = useChatRuntime({

	})

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{children}
		</AssistantRuntimeProvider>
	);
}
