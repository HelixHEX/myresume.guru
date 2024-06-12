'use client';

import { useChat } from "ai/react";
import { useModalOpen } from "../ui/assistant-ui/assistant-modal";
import { Button } from "../ui/button";
import { useContext, useEffect } from "react";
import { context } from "@/lib/context";

export default function FeedbackSuggestion() {
  const {resume} = useContext(context.resume.LayoutContext)

  useEffect(() => {
    console.log(resume)
  }, [resume])
  const chat = useChat({
    api: "/api/ai/chat",
    id: "chat",
  })

  const setOpen = useModalOpen((s) => s.setOpen);
  
  const handleSuggestion = () => {
    chat.append({
      role: 'user',
      content: 'Answer any questions'
    })
    setOpen(true)
  }
  return (
    <>
    <Button>Elaborate on this</Button>
    </>
  )
}