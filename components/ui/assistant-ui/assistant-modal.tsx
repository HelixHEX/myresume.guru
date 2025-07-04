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
import { useGetResume } from "@/app/app/(resumes)/lib/queries";

type ModalOpen = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useModalOpen = create<ModalOpen>((set) => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
}));

export const AssistantModal = () => {
	const { open, setOpen } = useModalOpen();

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
			<Tooltip >
				<TooltipTrigger asChild>
					<Button
						variant="default"
						size="icon"
						className="fixed  z-40 right-4 bottom-4 size-12 rounded-full shadow hover:scale-70"
						{...rest}
						ref={forwardedRef}
					>
						<BotIcon
							className={cn(
								"absolute size-6 transition-all",
								state === "open" && "rotate-90 scale-0",
								state === "closed" && "rotate-0 scale-100",
							)}
						/>

						<ChevronDownIcon
							className={cn(
								"absolute size-6 transition-all",
								state === "open" && "rotate-0 scale-100",
								state === "closed" && "-rotate-90 scale-0",
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
