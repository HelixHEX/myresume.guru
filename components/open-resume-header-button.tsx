"use client";

import { useAppChatState } from "@/lib/providers/app-chat-provider";
import { getResumeForChat } from "@/lib/actions/chat";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OpenResumeHeaderButton() {
  const { selectedChatId } = useAppChatState();

  const { data: resume } = useQuery({
    queryKey: ["resumeForChat", selectedChatId],
    queryFn: () => getResumeForChat(selectedChatId!),
    enabled: selectedChatId != null,
  });

  if (selectedChatId == null || resume == null) {
    return null;
  }

  const href = `/app/resumes/${encodeURIComponent(resume.fileKey ?? String(resume.id))}`;

  return (
    <Button
      // variant="ghost"
      size="sm"
      // className="hover:bg-blue-800 hover:text-white text-blue-800 font-medium"
      aria-label="Open resume"
      asChild
    >
      <Link href={href}>Open resume</Link>
    </Button>
  );
}
