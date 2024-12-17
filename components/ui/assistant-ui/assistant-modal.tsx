"use client";

import { BotIcon, ChevronDownIcon } from "lucide-react";

import { Thread } from "@/components/ui/assistant-ui/thread";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { forwardRef, useContext, useState } from "react";
import { create } from "zustand";
import { context } from "@/lib/context";

type ModalOpen = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useModalOpen = create<ModalOpen>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));

export const AssistantModal = () => {
  const { resume } = useContext(context.resume.ResumeContext)


  const { open, setOpen } = useModalOpen();

  if (!resume) return null

  if (resume.status !== "Analyzed") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="fixed bottom-4 right-4 h-12 w-12 rounded-full"
              disabled
            >
              <BotIcon className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Please wait for resume analysis to complete before chatting</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FloatingAssistantButton />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="h-[500px] w-screen md:w-[400px] rounded p-0"
      >
        <Thread />
      </PopoverContent>
    </Popover>
  );
};

type FloatingAssistantButton = { "data-state"?: "open" | "closed" };

const FloatingAssistantButton = forwardRef<
  HTMLButtonElement,
  FloatingAssistantButton
>(function FABImpl({ "data-state": state, ...rest }, forwardedRef) {
  const tooltip = state === "open" ? "Close Assistant" : "Open Assistant";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed right-4 bottom-4 size-12 rounded-full shadow hover:scale-70"
            {...rest}
            ref={forwardedRef}
          >
            <BotIcon
              className={cn(
                "absolute size-6 transition-all",
                state === "open" && "rotate-90 scale-0",
                state === "closed" && "rotate-0 scale-100"
              )}
            />

            <ChevronDownIcon
              className={cn(
                "absolute size-6 transition-all",
                state === "open" && "rotate-0 scale-100",
                state === "closed" && "-rotate-90 scale-0"
              )}
            />
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
