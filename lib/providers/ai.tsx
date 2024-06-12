"use client";

import { useChat, type Message } from "ai/react";
import {
  AssistantRuntimeProvider,
  useVercelUseChatRuntime,
} from "@assistant-ui/react";
import { generateId } from "ai";
import { useContext, useEffect } from "react";
import { context } from "../context";
import { saveMessageToDb } from "@/actions";
import { api } from "../api";

export default function AssistantProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { resume, feedbacks } = useContext(context.resume.LayoutContext);

  const { data } = api.queries.chat.useGetMessages({
    resumeId: resume?.id,
    enabled: resume?.id !== null,
  });

  const chat = useChat({
    api: "/api/ai/chat",
    id: "chat",
    initialMessages: data?.map((m) => ({
      id: m.id.toString(),
      content: m.content,
      role: m.role as "user" | "assistant" | "system",
    } satisfies Message)),

    onFinish: (message) => {
      saveMessageToDb({
        message,
        resumeId: resume?.id,
        applicationId: resume?.applicationId,
        userId: resume?.userId,
      });
    },
    body: {
      context: [
        {
          role: "system",
          content:
            "You area resume analyzer tool. You will be analyzing a user-uploaded resume that has been converted to plain text. You also have already provided some feedback on the resume. Your job is to answer any questions the user has about their resume or the feedback provided",
        },
        {
          role: "system",
          content: `resume: ${resume?.text}`,
        },
        {
          role: "system",
          content: `feedback you have already provided. Use it as context for responding to any questions users have: ${feedbacks
            .map((f, index) => {
              return `\n- ${f.title}: ${f.text ?? ""} \n${f.actionableFeedbacks
                ?.map(
                  (aF, aFIndex) =>
                    `${aFIndex + 1}. ${aF.title}: ${aF.text ?? ""}`
                )
                .join("\n")}`;
            })
            .join("")}`,
        },
      ],
      resumeId: resume?.id,
      applicationId: resume?.applicationId,
      userId: resume?.userId,
    },
  });

  const runtime = useVercelUseChatRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
