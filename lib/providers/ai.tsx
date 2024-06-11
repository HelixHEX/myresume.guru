"use client";
 
import { useChat } from 'ai/react';
import { AssistantRuntimeProvider, useVercelUseChatRuntime } from '@assistant-ui/react';
 
export default function AssistantProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  const chat = useChat({
    api: '/api/ai/chat',
  });
 
  const runtime = useVercelUseChatRuntime(chat);
 
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}

