"use client";

import React from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

const isModifyResumeToolPart = (
  part: { type?: string; toolName?: string; state?: string; output?: { success?: boolean } }
): boolean =>
  (part.type === "tool-modifyResume" || (part.type === "dynamic-tool" && part.toolName === "modifyResume")) &&
  part.state === "output-available" &&
  part.output?.success === true;

type InitialMessage = { id: string; role: string; content: string };

export default function AIProvider({
  children,
  fileKey,
  initialMessages = [],
}: {
  children: React.ReactNode;
  /** Resume identifier: fileKey (or numeric id as string for URLs like /app/resumes/5). Sent as fileKey to the API. */
  fileKey: string;
  /** Chat history for this resume (from getMessagesFromDB). */
  initialMessages?: InitialMessage[];
}) {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const queryClient = useQueryClient();

  const messages = React.useMemo(
    () =>
      initialMessages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        parts: [{ type: "text" as const, text: m.content }],
      })),
    [initialMessages]
  );

  const runtime = useChatRuntime({
    messages,
    transport: new AssistantChatTransport({
      api: "/api/chat",
      body: {
        fileKey,
        userId,
      },
    }),
    onFinish: ({ message }) => {
      const parts = (message as { parts?: unknown[] })?.parts ?? [];
      const resumeWasUpdated = parts.some((part) => isModifyResumeToolPart(part as { type?: string; toolName?: string; state?: string; output?: { success?: boolean } }));
      if (resumeWasUpdated && fileKey) {
        queryClient.invalidateQueries({ queryKey: ["resume", fileKey] });
        queryClient.invalidateQueries({ queryKey: ["resume_editor_data", fileKey] });
      }
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
