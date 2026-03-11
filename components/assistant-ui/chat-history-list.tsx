"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { useAppChatState } from "@/lib/providers/app-chat-provider";
import { Button } from "@/components/ui/button";

export const ChatHistoryList: FC = () => {
  const router = useRouter();
  const { chats, isChatsLoading, selectedChatId } = useAppChatState();

  const handleNewChatClick = () => {
    router.replace("/app/chat/new", { scroll: false });
  };

  const handleChatSelect = (chatId: number) => {
    router.replace(`/app/chat/${chatId}`, { scroll: false });
  };

  const handleChatKeyDown = (e: React.KeyboardEvent, chatId: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleChatSelect(chatId);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-1.5">
      <Button
        className="hover:bg-neutral-100 flex items-center justify-start gap-1 rounded-lg px-2.5 py-2 text-start dark:hover:bg-neutral-800"
        variant="ghost"
        onClick={handleNewChatClick}
        aria-label="New chat"
      >
        <PlusIcon />
        New Chat
      </Button>
      {isChatsLoading ? (
        <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400" aria-live="polite">
          Loading…
        </div>
      ) : chats.length === 0 ? (
        <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">No chats yet</div>
      ) : (
        <ul className="flex flex-col items-stretch gap-1 list-none p-0 m-0" aria-label="Chat list">
          {chats.map((chat) => {
            const isActive = selectedChatId === chat.id;
            const title = chat.title?.trim() || "New Chat";
            return (
              <li key={chat.id}>
                <button
                  type="button"
                  tabIndex={0}
                  aria-label={title}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-all focus-visible:outline-none focus-visible:ring-2 dark:focus-visible:ring-neutral-300 ${
                    isActive
                      ? "bg-neutral-100 ring-neutral-950 focus-visible:bg-neutral-100 focus-visible:ring-2 dark:bg-neutral-800 dark:focus-visible:bg-neutral-800 dark:focus-visible:ring-neutral-300"
                      : "hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-neutral-950 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 dark:focus-visible:ring-neutral-300"
                  }`}
                  onClick={() => handleChatSelect(chat.id)}
                  onKeyDown={(e) => handleChatKeyDown(e, chat.id)}
                >
                  <span className="min-w-0 flex-1 truncate">{title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
