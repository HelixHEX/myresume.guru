import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const RANGE_DAYS: Record<string, number> = {
	"7d": 7,
	"30d": 30,
	"90d": 90,
};

export async function GET(req: Request) {
	const userId = await auth().then((a) => a.userId);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(req.url);
	const range = searchParams.get("range") ?? "30d";
	const days = RANGE_DAYS[range] ?? 30;

	const since = new Date();
	since.setDate(since.getDate() - days);
	since.setHours(0, 0, 0, 0);

	const usageWhere = {
		userId,
		createdAt: { gte: since },
	};

	const messageWhere = {
		userId,
		role: "assistant",
		createdAt: { gte: since },
	};

	const [summaryAgg, byModelRows, usageChatIds, messagesCount, distinctChatIdsFromMessages] =
		await Promise.all([
			prisma.aiUsage.aggregate({
				where: usageWhere,
				_count: true,
				_sum: {
					inputTokens: true,
					cachedInputTokens: true,
					outputTokens: true,
				},
			}),
			prisma.aiUsage.groupBy({
				by: ["model"],
				where: usageWhere,
				_count: true,
				_sum: {
					inputTokens: true,
					cachedInputTokens: true,
					outputTokens: true,
				},
			}),
			prisma.aiUsage.findMany({
				where: usageWhere,
				select: { chatId: true },
			}),
			prisma.message.count({ where: messageWhere }),
			prisma.message.findMany({
				where: messageWhere,
				select: { chatId: true },
			}),
		]);

	const totalTokens =
		(summaryAgg._sum.inputTokens ?? 0) +
		(summaryAgg._sum.cachedInputTokens ?? 0) +
		(summaryAgg._sum.outputTokens ?? 0);

	const usageChatsSet = new Set(
		usageChatIds.map((r) => (r.chatId != null ? r.chatId : "n"))
	);
	const messageChatsSet = new Set(
		distinctChatIdsFromMessages
			.filter((r) => r.chatId != null)
			.map((r) => r.chatId as number)
	);
	const chatsCount = new Set([...messageChatsSet, ...usageChatsSet]).size;

	const byModel = byModelRows
		.map((row) => {
			const tokens =
				(row._sum.inputTokens ?? 0) +
				(row._sum.cachedInputTokens ?? 0) +
				(row._sum.outputTokens ?? 0);
			const percent = totalTokens > 0 ? (tokens / totalTokens) * 100 : 0;
			return {
				model: row.model,
				messages: row._count,
				tokens,
				percent: Math.round(percent * 10) / 10,
			};
		})
		.sort((a, b) => b.tokens - a.tokens);

	return NextResponse.json({
		summary: {
			messages: messagesCount,
			tokens: totalTokens,
			chats: chatsCount,
		},
		byModel,
	});
}
