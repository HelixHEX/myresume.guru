import prisma from "@/lib/prisma";
import { addCreditTransaction } from "@/lib/credits";
import { updateDbWithLatestSubscriptionData } from "@/lib/polar";
import { Webhooks } from "@polar-sh/nextjs";
import type { WebhooksConfig } from "@polar-sh/adapter-utils";
import type { Order } from "@polar-sh/sdk/models/components/order.js";
import { CREDIT_PACKS } from "@/lib/credit-packs";

type PolarWebhookPayload = Parameters<NonNullable<WebhooksConfig["onPayload"]>>[0];

function resolveCreditPack(order: Order) {
	const packId = order.metadata?.packId as string | undefined;
	if (packId) {
		const pack = CREDIT_PACKS.find((p) => p.id === packId);
		if (pack) return pack;
	}

	// Fallback: match by productId against env-configured product IDs
	for (const pack of CREDIT_PACKS) {
		const productId = process.env[pack.envProductIdKey];
		if (productId && order.productId === productId) {
			return pack;
		}
	}
	return undefined;
}

export const POST = Webhooks({
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
	//biome-ignore lint:Will fix later.
	onPayload: async (payload: PolarWebhookPayload) => {
		console.log("[Polar][Webhook] Payload", payload.type);

		switch (payload.type) {
			case "subscription.updated":
				await updateDbWithLatestSubscriptionData(payload.data.id);
				break;
			case "order.paid": {
				const order = payload.data;
				if (order.billingReason !== "purchase") break;
				const pack = resolveCreditPack(order);
				if (!pack) {
					console.log(
						"[Polar][Webhook] order.paid ignored: not configured credit pack",
						order.productId,
					);
					break;
				}
				const userId = order.metadata?.userId;
				if (typeof userId !== "string" || !userId) {
					console.error("[Polar][Webhook] order.paid: missing metadata.userId", order.id);
					break;
				}
				const existing = await prisma.creditTransaction.findFirst({
					where: { referenceId: order.id },
				});
				if (existing) {
					console.log("[Polar][Webhook] order.paid idempotent skip", order.id);
					break;
				}
				const credits = pack.credits;
				await addCreditTransaction({
					userId,
					type: "purchase",
					amount: credits,
					referenceId: order.id,
					metadata: {
						productId: order.productId,
						packId: pack.id,
						orderId: order.id,
						totalAmountCents: order.totalAmount,
						currency: order.currency,
					},
				});
				console.log("[Polar][Webhook] order.paid credits added", order.id, credits);
				break;
			}
			default:
				console.log("[Polar][Webhook] Unknown event type", payload.type);
				break;
		}
	},
});