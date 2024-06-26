"use client";

import { useChat } from "ai/react";
import { useModalOpen } from "../ui/assistant-ui/assistant-modal";
import { Button } from "../ui/button";
import { useContext, useEffect } from "react";
import { context } from "@/lib/context";

export default function FeedbackSuggestion() {
  const { resume } = useContext(context.resume.ResumeContext);

  const chat = useChat({
    api: "/api/ai/chat",
    id: "chat",
    // body: {
    //   context: [
        
    //   ]
    // }
  });
  const setOpen = useModalOpen((s) => s.setOpen);

  if (!resume) return null;

  const handleSuggestion = () => {
    chat.append({
      role: "user",
      content: "Answer any questions",
    });
    setOpen(true);
  };
  return (
    <>
      <Button>Elaborate on this</Button>
    </>
  );
}
