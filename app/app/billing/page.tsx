"use client";

import { useCallback, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CreditPackModal } from "@/components/credit-pack-modal";
import { MessageSquareIcon, CoinsIcon, HashIcon } from "lucide-react";
import Link from "next/link";
import { useUsage } from "./lib/queries";

const RANGE_OPTIONS = [
	{ value: "7d", label: "Last 7 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "90d", label: "Last 90 days" },
] as const;

function formatTokens(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return String(n);
}

export default function BillingPage() {
	const [range, setRange] = useState<string>("30d");
	const { data, isLoading, isError } = useUsage(range);
	const [showPackModal, setShowPackModal] = useState(false);

	const handleBuyCredits = useCallback(() => {
		setShowPackModal(true);
	}, []);

	return (
		<div className="flex h-full flex-col overflow-auto">
			<div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
				<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
							Usage & Billing
						</h1>
						<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
							AI usage and credit balance. Message counts are based on assistant responses.
						</p>
					</div>
					<Select value={range} onValueChange={setRange}>
						<SelectTrigger className="w-[180px]" aria-label="Date range">
							<SelectValue placeholder="Last 30 days" />
						</SelectTrigger>
						<SelectContent>
							{RANGE_OPTIONS.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Summary cards */}
				<div className="grid gap-4 sm:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Messages
							</CardTitle>
							<MessageSquareIcon className="size-4 text-neutral-400" aria-hidden />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<span className="text-2xl font-bold tabular-nums">—</span>
							) : isError ? (
								<span className="text-2xl font-bold text-red-600 dark:text-red-400">Error</span>
							) : (
								<span className="text-2xl font-bold tabular-nums">
									{data?.summary.messages.toLocaleString() ?? 0}
								</span>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Tokens
							</CardTitle>
							<HashIcon className="size-4 text-neutral-400" aria-hidden />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<span className="text-2xl font-bold tabular-nums">—</span>
							) : isError ? (
								<span className="text-2xl font-bold text-red-600 dark:text-red-400">Error</span>
							) : (
								<span className="text-2xl font-bold tabular-nums">
									{data?.summary.tokens != null ? formatTokens(data.summary.tokens) : "0"}
								</span>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Chats
							</CardTitle>
							<MessageSquareIcon className="size-4 text-neutral-400" aria-hidden />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<span className="text-2xl font-bold tabular-nums">—</span>
							) : isError ? (
								<span className="text-2xl font-bold text-red-600 dark:text-red-400">Error</span>
							) : (
								<span className="text-2xl font-bold tabular-nums">
									{data?.summary.chats.toLocaleString() ?? 0}
								</span>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Model usage table */}
				<Card>
					<CardHeader>
						<CardTitle>Model usage</CardTitle>
						<CardDescription>Tokens and messages per model in the selected period.</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<p className="text-sm text-neutral-500 dark:text-neutral-400">Loading…</p>
						) : isError ? (
							<p className="text-sm text-red-600 dark:text-red-400">Failed to load usage.</p>
						) : !data?.byModel?.length ? (
							<p className="text-sm text-neutral-500 dark:text-neutral-400">
								No usage in this period.
							</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Model</TableHead>
										<TableHead className="text-right">Messages</TableHead>
										<TableHead className="text-right">Tokens</TableHead>
										<TableHead className="text-right">%</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.byModel.map((row) => (
										<TableRow key={row.model}>
											<TableCell className="font-medium">{row.model}</TableCell>
											<TableCell className="text-right tabular-nums">
												{row.messages.toLocaleString()}
											</TableCell>
											<TableCell className="text-right tabular-nums">
												{formatTokens(row.tokens)}
											</TableCell>
											<TableCell className="text-right tabular-nums">
												{row.percent}%
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{/* Actions */}
				<Card>
					<CardHeader>
						<CardTitle>Credits & subscription</CardTitle>
						<CardDescription>
							Buy more AI credits or manage your subscription.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						<Button onClick={handleBuyCredits} aria-label="Buy credits">
							<CoinsIcon className="mr-2 size-4" aria-hidden />
							Buy credits
						</Button>
						<Button variant="outline" asChild>
							<Link href="/plans" aria-label="View plans">
								View plans
							</Link>
						</Button>
						<Button variant="ghost" asChild>
							<a
								href="https://polar.sh/myresumeguru/portal"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Open Polar customer portal in new tab"
							>
								Manage subscription
							</a>
						</Button>
					</CardContent>
				</Card>
			</div>
			<CreditPackModal open={showPackModal} onOpenChange={setShowPackModal} />
		</div>
	);
}
