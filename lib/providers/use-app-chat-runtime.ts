"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import type { AssistantRuntime } from "@assistant-ui/react";
import { useAISDKRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import type { ChatInit } from "ai";
import { useMemo, useEffect } from "react";

/**
 * Single-thread chat runtime so the composer is never the disabled "empty thread".
 * useChatRuntime() uses a remote thread list; without a mounted ThreadList the main
 * thread can stay the empty placeholder (isDisabled: true), which disables the input.
 * This hook uses the same useChat + useAISDKRuntime flow as useChatThreadRuntime
 * so we always have a real thread and the input is typeable.
 */
export type UseAppChatRuntimeOptions<UI_MESSAGE extends UIMessage = UIMessage> =
  ChatInit<UI_MESSAGE>;

export function useAppChatRuntime<UI_MESSAGE extends UIMessage = UIMessage>(
  options: UseAppChatRuntimeOptions<UI_MESSAGE>
): AssistantRuntime {
  const { transport: transportOptions, ...chatOptions } = options;
  const transport = useMemo(
    () => transportOptions ?? new AssistantChatTransport(),
    [transportOptions]
  );

  const chat = useChat({
    ...chatOptions,
    transport,
    onToolCall: async ({ toolCall }) => {
      await chatOptions.onToolCall?.({ toolCall });
      const tools = runtime.thread.getModelContext().tools;
      const tool = tools?.[toolCall.toolName];
      if (tool) {
        try {
          const result = await tool.execute?.(toolCall.input, {
            toolCallId: toolCall.toolCallId,
            abortSignal: new AbortController().signal,
          });
          chat.addToolResult({
            tool: toolCall.toolName,
            toolCallId: toolCall.toolCallId,
            output: result,
          });
        } catch (error) {
          chat.addToolResult({
            tool: toolCall.toolName,
            toolCallId: toolCall.toolCallId,
            output: {
              error: error instanceof Error ? error.message : String(error),
            },
          });
        }
      }
    },
  });

  const runtime = useAISDKRuntime(chat as ReturnType<typeof useChat<UI_MESSAGE>>, {
    adapters: {},
  });

  useEffect(() => {
    if (transport instanceof AssistantChatTransport) {
      transport.setRuntime(runtime);
    }
  }, [transport, runtime]);

  return runtime;
}
