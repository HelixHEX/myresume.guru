"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { CoinsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditPackModal } from "@/components/credit-pack-modal";

const CREDITS_QUERY_KEY = ["user", "credits"];

async function fetchCredits(): Promise<{ balance: number }> {
	const res = await fetch("/api/user/credits", { credentials: "include" });
	if (!res.ok) throw new Error("Failed to fetch credits");
	return res.json();
}

export function CreditsBalance() {
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const [showPackModal, setShowPackModal] = useState(false);
	const { data, isLoading, isError } = useQuery({
		queryKey: CREDITS_QUERY_KEY,
		queryFn: fetchCredits,
	});

	useEffect(() => {
		if (searchParams.get("credit_pack") === "success") {
			queryClient.invalidateQueries({ queryKey: CREDITS_QUERY_KEY });
			setShowPackModal(false);
		}
	}, [searchParams, queryClient]);

	const handleBuyCredits = useCallback(() => {
		setShowPackModal(true);
	}, []);

	if (isLoading || isError) {
		return (
			<span className="text-muted-foreground text-sm" aria-hidden="true">
				—
			</span>
		);
	}

	const balance = data?.balance ?? 0;

	return (
		<>
			<div className="flex items-center gap-2">
				<span
					className="text-sm font-medium tabular-nums text-neutral-600 dark:text-neutral-400"
					aria-label={`Credit balance: ${balance}`}
				>
					<CoinsIcon className="mr-1 inline-block size-4 align-middle" aria-hidden />
					{balance.toLocaleString()} credits
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={handleBuyCredits}
					className="shrink-0"
					aria-label="Buy credits"
				>
					Buy credits
				</Button>
			</div>
			<CreditPackModal open={showPackModal} onOpenChange={setShowPackModal} />
		</>
	);
}

export { CREDITS_QUERY_KEY };
