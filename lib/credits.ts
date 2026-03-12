import prisma from "@/lib/prisma";
import { MODEL_PRICING, type ChatModelId } from "@/lib/model-router";

/** 1000 credits = $1 (1 credit = $0.001). */
export const CREDITS_PER_USD = 1000;

/**
 * Convert an amount in USD cents (e.g. Polar order.totalAmount) to credits.
 * Use for pay-what-you-want purchases where the user pays a variable amount.
 */
export function usdCentsToCredits(cents: number): number {
	return Math.max(0, Math.floor((cents / 100) * CREDITS_PER_USD));
}

/** Usage shape from AI SDK (event.usage / event.totalUsage). */
export type UsageLike = {
	inputTokens?: number;
	inputTokenDetails?: {
		noCacheTokens?: number;
		cacheReadTokens?: number;
		cacheWriteTokens?: number;
	};
	outputTokens?: number;
};

/**
 * Compute cost in USD and credits from token usage for a given model.
 * Uses MODEL_PRICING; unknown models fall back to gpt-5-mini.
 */
export function computeCreditsFromUsage(
	usage: UsageLike,
	modelName: string
): { costUsd: number; credits: number } {
	const pricing =
		MODEL_PRICING[modelName as ChatModelId] ?? MODEL_PRICING["gpt-5-mini"];
	const noCache = usage.inputTokenDetails?.noCacheTokens ?? usage.inputTokens ?? 0;
	const cacheRead = usage.inputTokenDetails?.cacheReadTokens ?? 0;
	const cacheWrite = usage.inputTokenDetails?.cacheWriteTokens ?? 0;
	const output = usage.outputTokens ?? 0;

	const inputCost =
		((noCache + cacheWrite) * pricing.input + cacheRead * pricing.cachedInput) / 1e6;
	const outputCost = (output * pricing.output) / 1e6;
	const costUsd = inputCost + outputCost;
	const credits = Math.max(0, Math.ceil(costUsd * CREDITS_PER_USD));
	return { costUsd, credits };
}

/**
 * Get current credit balance for a user (sum of all CreditTransaction.amount).
 */
export async function getBalance(userId: string): Promise<number> {
	const result = await prisma.creditTransaction.aggregate({
		where: { userId },
		_sum: { amount: true },
	});
	return result._sum.amount ?? 0;
}

/**
 * Insert a credit transaction (e.g. usage deduction or purchase).
 * Does not check balance; caller must enforce thresholds.
 */
export async function addCreditTransaction(params: {
	userId: string;
	type: string;
	amount: number;
	referenceId?: string | null;
	metadata?: unknown;
}): Promise<void> {
	await prisma.creditTransaction.create({
		data: {
			userId: params.userId,
			type: params.type,
			amount: params.amount,
			referenceId: params.referenceId ?? undefined,
			metadata: params.metadata ? (params.metadata as object) : undefined,
		},
	});
}

/**
 * Record one AI usage row and deduct credits in a single transaction.
 * Call from chat onFinish. Idempotent if requestId is provided and AiUsage with that requestId exists.
 */
export async function recordUsageAndDeduct(params: {
	userId: string;
	chatId: number | null;
	messageId: string | null;
	model: string;
	inputTokens: number;
	cachedInputTokens: number;
	outputTokens: number;
	costUsd: number;
	creditsDeducted: number;
	requestId?: string | null;
}): Promise<void> {
	const {
		userId,
		chatId,
		messageId,
		model,
		inputTokens,
		cachedInputTokens,
		outputTokens,
		costUsd,
		creditsDeducted,
		requestId,
	} = params;

	if (requestId) {
		const existing = await prisma.aiUsage.findFirst({
			where: { requestId },
		});
		if (existing) return;
	}

	await prisma.$transaction(async (tx) => {
		const usage = await tx.aiUsage.create({
			data: {
				userId,
				chatId: chatId ?? undefined,
				messageId: messageId ?? undefined,
				model,
				inputTokens,
				cachedInputTokens,
				outputTokens,
				costUsd,
				creditsDeducted,
				requestId: requestId ?? undefined,
			},
		});
		await tx.creditTransaction.create({
			data: {
				userId,
				type: "usage",
				amount: -creditsDeducted,
				referenceId: String(usage.id),
			},
		});
	});
}
