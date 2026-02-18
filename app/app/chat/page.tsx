import { ChatPageContent } from "@/components/chat-page-content";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full flex-1 min-h-0 w-full">
      <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200 shrink-0 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        Chat
      </h1>
      <div className="flex-1 min-h-0">
        <ChatPageContent />
      </div>
    </div>
  );
}
