"use client";

import { getFile } from "@/lib/utils";
import {
	makeAssistantTool,
	tool,
	useAssistantRuntime,
} from "@assistant-ui/react";
import { useEffect } from "react";
import { z } from "zod";
import { useRouter } from "next/router";

const getResumeFile = tool({
	parameters: z.object({
		fileKey: z.string(),
	}),
	execute: async ({ fileKey }) => {
		const resume = await getFile(fileKey);
		return { resume };
	},
});

const GetResumeTool = makeAssistantTool({
	toolName: "getResumeFile",
	...getResumeFile,
});
// Create a tool component

export default function AssistantToolsAndInstructions() {
	const router = useRouter();
	const fileKey = router.query.fileKey as string;
	const assistantRuntime = useAssistantRuntime();

	useEffect(() => {
		// Register context provider
		return assistantRuntime.registerModelContextProvider({
			getModelContext: () => ({
				system:
					"You are a resume guru assistant. You have access to the resume tool which will return the resume in an ArrayBuffer format.",
					
				tools: { getResumeFile },
			}),
		});
	}, [assistantRuntime]); // Re-register if runtime changes

	return (
		<>
			<GetResumeTool />
		</>
	);
}
