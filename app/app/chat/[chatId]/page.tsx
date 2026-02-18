import { ChatPageContent } from "@/components/chat-page-content";

export default async function ChatWithIdPage(props: {
  params: Promise<{ chatId: string }>;
}) {
  const params = await props.params;
  const chatIdParam = params.chatId ?? "";
  const isNew = chatIdParam === "new";
  const numericId = isNew ? undefined : Number(chatIdParam);
  const validId = Number.isInteger(numericId) && numericId !== undefined ? numericId : undefined;

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 w-full">
      <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200 shrink-0 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        Chat
      </h1>
      <div className="flex-1 min-h-0">
        <ChatPageContent initialChatId={validId} isNewChat={isNew} />
      </div>
    </div>
  );
}
