"use client";

import { useAuiState } from "@assistant-ui/react";
import { createCreditPackCheckout } from "@/lib/actions/checkout";
import { Button } from "@/components/ui/button";

type CreditsErrorPayload = {
	error?: string;
	code?: string;
	balance?: number;
};

function parseCreditsError(message: string): CreditsErrorPayload | null {
	try {
		const parsed = JSON.parse(message) as CreditsErrorPayload;
		return typeof parsed === "object" && parsed !== null ? parsed : null;
	} catch {
		return null;
	}
}

/**
 * Renders inside MessagePrimitive.Error. When the error is our 402 response (INSUFFICIENT_CREDITS),
 * shows a friendly message and "Buy credits" button. Otherwise shows the raw error text.
 */
export function InsufficientCreditsMessage() {
	const error = useAuiState((s) =>
		s.message.status?.type === "incomplete" && s.message.status.reason === "error"
			? s.message.status.error
			: undefined
	);

	if (error === undefined) return null;

	const parsed = parseCreditsError(String(error));
	const isInsufficientCredits = parsed?.code === "INSUFFICIENT_CREDITS";

	if (isInsufficientCredits) {
		return (
			<div
				className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100"
				role="alert"
			>
				<p className="font-medium">Insufficient credits</p>
				<p className="mt-1 text-amber-800 dark:text-amber-200">
					You don’t have enough credits to send this message. Buy credits to continue.
				</p>
				<Button
					variant="outline"
					size="sm"
					className="mt-2 border-amber-300 dark:border-amber-700"
					onClick={() => createCreditPackCheckout()}
					aria-label="Buy credits"
				>
					Buy credits
				</Button>
			</div>
		);
	}

	return <span className="text-sm text-red-600 dark:text-red-400">{String(error)}</span>;
}
