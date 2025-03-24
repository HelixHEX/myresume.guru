"use client";

import {
	BotIcon,
	ChevronDownIcon,
	MessageCircle,
	MessageCircleIcon,
} from "lucide-react";

import { type FC, forwardRef, useEffect, useState } from "react";
import { AssistantModalPrimitive, useThreadRuntime } from "@assistant-ui/react";

import { Thread } from "@/components/assistant-ui/thread";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const useAssistantModalOpenState = ({
	defaultOpen = false,
	unstable_openOnRunStart = true,
}: {
	defaultOpen?: boolean | undefined;
	unstable_openOnRunStart?: boolean | undefined;
}) => {
	const state = useState(defaultOpen);

	const [, setOpen] = state;
	const threadRuntime = useThreadRuntime();
	console.log(threadRuntime);
	useEffect(() => {
		if (!unstable_openOnRunStart) return undefined;

		return threadRuntime.unstable_on("run-start", () => {
			setOpen(true);
		});
	}, [
		unstable_openOnRunStart,
		setOpen,
		threadRuntime,
	]);

	return state;
};

export const AssistantModal: FC = () => {
	const router = useRouter();
	const { user } = useUser();

	if (!user) return null;

	return (
		<AssistantModalPrimitive.Root>
			<AssistantModalPrimitive.Anchor className="fixed bottom-4 right-4 size-11">
				<AssistantModalPrimitive.Trigger asChild>
					<AssistantModalButton />
				</AssistantModalPrimitive.Trigger>
			</AssistantModalPrimitive.Anchor>
			<AssistantModalPrimitive.Content
				sideOffset={16}
				className="bg-white text-neutral-950 z-50 h-[500px] w-[400px] overflow-clip rounded-xl border border-neutral-200 p-0 shadow-md outline-none [&>.aui-thread-root]:bg-inherit data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out data-[state=open]:zoom-in data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 dark:bg-neutral-950 dark:text-neutral-50 dark:border-neutral-800"
			>
				{user!.unsafeMetadata.plan === "Plus" ? (
					<Thread />
				) : (
					<div className="flex flex-col text-center items-center justify-center h-full">
						<h1 className="text-lg w-full sm:w-3/4 font-bold">
							Upgrade your plan to use the AI Chat feature
						</h1>
						<p className="text-sm w-full sm:w-4/5 mt-2">
							With the Guru Plus plan, you get a personalized resume assistant
							and unlimited daily feedback.
						</p>
						<Button
							variant={"ghost"}
							onClick={() => router.push("/plans")}
							className="mt-4 font-bold hover:bg-transparent hover:text-blue-800 hover:cursor-pointer"
						>
							Upgrade Now
						</Button>
					</div>
				)}
			</AssistantModalPrimitive.Content>
		</AssistantModalPrimitive.Root>
	);
};

type AssistantModalButtonProps = { "data-state"?: "open" | "closed" };

const AssistantModalButton = forwardRef<
	HTMLButtonElement,
	AssistantModalButtonProps
>(({ "data-state": state, ...rest }, ref) => {
	const tooltip = state === "open" ? "Close Chat" : "Open Chat";

	return (
		<TooltipIconButton
			variant="default"
			tooltip={tooltip}
			side="left"
			{...rest}
			className="size-full hover:cursor-pointer rounded-full shadow transition-transform hover:scale-110 active:scale-90"
			ref={ref}
		>
			<MessageCircle
				data-state={state}
				className="absolute w-20px] h-[20px] transition-all data-[state=closed]:rotate-0 data-[state=open]:rotate-90 data-[state=closed]:scale-100 data-[state=open]:scale-0"
			/>

			<ChevronDownIcon
				data-state={state}
				className="absolute size-6 transition-all data-[state=closed]:-rotate-90 data-[state=open]:rotate-0 data-[state=closed]:scale-0 data-[state=open]:scale-100"
			/>
			<span className="sr-only">{tooltip}</span>
		</TooltipIconButton>
	);
});

AssistantModalButton.displayName = "AssistantModalButton";
