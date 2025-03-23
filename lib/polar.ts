import { Polar } from "@polar-sh/sdk";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "./prisma";

export const polar = new Polar({
	//biome-ignore lint:Will fix later.
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	server: process.env.URL === "https://bulehbreakfastinbed.com" ? "production" : "sandbox", // Use sandbox for testing purposes - otherwise use 'production' or omit this line
});


export const updateDbWithLatestSubscriptionData = async (subscriptionId: string) => {
	const clerk = await clerkClient();
	const subscription = await polar.subscriptions.get({ id: subscriptionId });
	const { userId } = subscription.metadata as { userId: string };

	if (!subscription) {
		console.log("[POLAR][SYNC] Checkout session not found", subscriptionId);
		throw new Error("Checkout session not found");
	}

	const user = await clerk.users.getUser(userId);

	if (!user) {
		console.log("[POLAR][SYNC] User not found", userId);
		throw new Error("User not found");
	}


	await prisma.subscription.upsert({
		where: {
			userId: user.id,
		},
		create: {
			userId: user.id,
			status: subscription.status,
			plan: 'Plus',
			priceId: subscription.prices[0].id,
			polarCustomerId: subscription.customerId,
			polarSubscriptionId: subscription.id,
		},
		update: {
			status: subscription.status,
			plan: 'Plus',
			priceId: subscription.prices[0].id,
			polarSubscriptionId: subscription.id,
		}
	})
}