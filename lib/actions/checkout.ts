'use server';

import { POLAR_CUSTOMER_ID_KV } from "../store";
import { getUrl } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { polar } from "@/lib/polar";
import { redirect } from "next/navigation";
import type { Checkout } from "@polar-sh/sdk/models/components/checkout.js";
import type { CheckoutCreate } from "@polar-sh/sdk/models/components/checkoutcreate.js";
import prisma from "@/lib/prisma";
import { CREDIT_PACKS_BY_ID, type CreditPackId } from "@/lib/credit-packs";

/** Create Polar checkout link for a one-time credit pack. Redirects to Polar; webhook adds credits on order.paid. */
export async function createCreditPackCheckout(packId: CreditPackId) {
	let redirectPath: string | null = null;
	try {
		const user = await currentUser();
		if (!user) throw new Error("Unauthorized");

		const pack = CREDIT_PACKS_BY_ID[packId];
		if (!pack) {
			throw new Error(`Unknown credit pack: ${packId}`);
		}

		const productId = process.env[pack.envProductIdKey];
		if (!productId) {
			throw new Error(
				`Credit pack product not configured (set ${pack.envProductIdKey} in env)`,
			);
		}

		// Keep Polar customer for consistency with other flows (checkout links don't take customerId)
		let polarCustomerId: string | unknown = await POLAR_CUSTOMER_ID_KV.get(user.id);
		if (!polarCustomerId) {
			const newPolarCustomer = await polar.customers.create({
				email: user.emailAddresses[0].emailAddress,
				name: user.fullName,
				metadata: { userId: user.id },
				billingAddress: { country: "US" },
			});
			POLAR_CUSTOMER_ID_KV.set(user.id, newPolarCustomer.id);
		}

		const checkoutLink = await polar.checkoutLinks.create({
			paymentProcessor: "stripe",
			products: [productId],
			allowDiscountCodes: false,
			requireBillingAddress: false,
			successUrl: getUrl("/app?credit_pack=success"),
			metadata: { userId: user.id, type: "credit_pack", packId },
		});

		if (!checkoutLink?.url) {
			throw new Error("Failed to create credit pack checkout.");
		}
		redirectPath = checkoutLink.url;
		return { success: true, redirectPath };
	} catch (error) {
		console.error("[Polar][Credit pack checkout] Error", error);
		throw error;
	} finally {
		if (redirectPath) redirect(redirectPath);
	}
}

export async function createCheckoutSession() {
  let redirectPath: string | null = null
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id
      }
    })

    console.log("[CHECKOUT][SUBSCRIPTION]", subscription)
    if (subscription) {
      return redirect(getUrl('/app'))

    }

    let polarCustomerId: string | unknown = await POLAR_CUSTOMER_ID_KV.get(user.id);
    console.log("[POLAR][CHECKOUTTT]", polarCustomerId)

    if (!polarCustomerId) {
      console.log("[Polar][Checkout Session] No Polar ID found, creating new customer");

      const newPolarCustomer = await polar.customers.create({
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName,
        metadata: {
          userId: user.id
        },
        billingAddress: {
          country: 'US'
        }
      })

      POLAR_CUSTOMER_ID_KV.set(user.id, newPolarCustomer.id);
      console.log("[Polar][Checkout Session] Customer Created", newPolarCustomer.id);
      polarCustomerId = newPolarCustomer.id;
    }

    // SDK CheckoutCreate type is products-only; API accepts productPriceId for subscription checkout
    const checkoutSession: Checkout = await polar.checkouts.create({
      productPriceId: process.env.POLAR_PRODUCT_PRICE_ID!,
      successUrl: getUrl("/app?polar_checkout_id={CHECKOUT_ID}"),
      customerId: polarCustomerId as string,
      metadata: { userId: user.id },
    } as unknown as CheckoutCreate)

    if (!checkoutSession) {
      console.log("[Polar][Checkout Session] Failed to create checkout session. Please refresh and try again.");
      throw new Error("Failed to create checkout session. Please refresh and try again.");
    }

    redirectPath = checkoutSession.url

    return {success: true, redirectPath}

  } catch (error) {
    console.log("[Polar][Checkout Session] Error creating checkout session", error);
    // throw new Error("Failed to create checkout session. Please refresh and try again.");
  } finally {
    redirect(redirectPath as string)
  }
}