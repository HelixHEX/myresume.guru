"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { ChatTrialLimitUpgrade, useChatTrialLimit } from "@/components/assistant-ui/chat-trial-limit-upgrade";
import { ChatUrlSync } from "@/components/chat-url-sync";
import { ChatSendInterceptorContext } from "@/lib/contexts/chat-send-interceptor";
import { useAppChatRuntimeConfig } from "@/lib/contexts/app-chat-runtime-context";
import { useAppChatState } from "@/lib/providers/app-chat-provider";
import { chatQueryKeys } from "@/lib/providers/app-chat-provider";
import { getMessagesFromDB } from "@/lib/actions/chat";
import { Button } from "@/components/ui/button";

type ChatPageContentProps = {
  /** When on /app/chat/[chatId], pass the id so this chat is selected. When chatId is "new", pass isNewChat. */
  initialChatId?: number;
  isNewChat?: boolean;
};

export function ChatPageContent({ initialChatId, isNewChat = false }: ChatPageContentProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isOverTrialLimit = useChatTrialLimit();
  const { selectedChatId, selectedChat, loadingChatId, handleNewChat, ensureChatSelected, clearSelectedChat } =
    useAppChatState();
  const { setInitialMessagesForChat } = useAppChatRuntimeConfig();

  const messagesQuery = useQuery({
    queryKey: chatQueryKeys.messages(initialChatId!),
    queryFn: () => getMessagesFromDB(initialChatId!),
    enabled: initialChatId != null && !isNewChat,
  });

  // Sync URL to provider: select chat by id or clear for /app/chat/new. Prefetch messages then switch so thread gets history.
  useLayoutEffect(() => {
    if (isNewChat) {
      clearSelectedChat();
      return;
    }
    if (initialChatId == null || selectedChatId === initialChatId) return;
    if (!messagesQuery.isSuccess || messagesQuery.data == null) return;
    setInitialMessagesForChat?.(initialChatId, messagesQuery.data as { id: string; role: string; content: string }[]);
    ensureChatSelected(initialChatId);
  }, [initialChatId, isNewChat, selectedChatId, messagesQuery.isSuccess, messagesQuery.data, setInitialMessagesForChat, ensureChatSelected, clearSelectedChat]);

  const pathname = usePathname();
  useEffect(() => {
    if (selectedChatId === null && pathname !== "/app/chat/new") {
      router.replace("/app/chat/new", { scroll: false });
    } else if (selectedChatId != null && pathname !== `/app/chat/${selectedChatId}`) {
      router.replace(`/app/chat/${selectedChatId}`, { scroll: false });
    }
  }, [selectedChatId, pathname, router]);

  const handleSendFromNew = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      handleNewChat().then((newChatId) => {
        if (newChatId != null) {
          const params = new URLSearchParams({ message: text.trim() });
          router.replace(`/app/chat/${newChatId}?${params.toString()}`, { scroll: false });
        }
      });
    },
    [handleNewChat, router]
  );

  return (
    <div className="flex h-full flex-1 min-h-0">
      {sidebarOpen && (
        <aside className="w-56 shrink-0 border-r border-neutral-200 flex flex-col bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <nav className="flex-1 overflow-y-auto p-2" aria-label="Chat history">
            <ThreadList />
          </nav>
        </aside>
      )}
      <main className="flex-1 min-w-0 flex flex-col bg-white dark:bg-neutral-950 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 z-10 size-8 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarOpen ? <PanelLeftCloseIcon className="size-4" /> : <PanelLeftOpenIcon className="size-4" />}
        </Button>
        {isOverTrialLimit ? (
          <ChatTrialLimitUpgrade />
        ) : loadingChatId != null || (initialChatId != null && selectedChatId !== initialChatId) ? (
          <div className="flex flex-1 items-center justify-center text-neutral-500 dark:text-neutral-400 text-sm p-4" aria-live="polite">
            Loading conversation…
          </div>
        ) : selectedChat || isNewChat ? (
          <ChatSendInterceptorContext.Provider value={isNewChat ? handleSendFromNew : null}>
            <ChatUrlSync isNewChat={isNewChat} />
            <Thread key={isNewChat ? "new" : selectedChatId!} />
          </ChatSendInterceptorContext.Provider>
        ) : (
          <div className="flex flex-1 items-center justify-center text-neutral-500 dark:text-neutral-400 text-sm p-4">
            Select a chat or create a new one
          </div>
        )}
      </main>
    </div>
  );
}
