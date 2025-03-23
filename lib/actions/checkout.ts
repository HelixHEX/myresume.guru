'use server';

import { POLAR_CUSTOMER_ID_KV } from "../store";
import { getUrl } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { polar } from "@/lib/polar";
import { redirect } from 'next/navigation'
import type { Checkout } from "@polar-sh/sdk/models/components/checkout.js";
import prisma from "@/lib/prisma";
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

    const checkoutSession: Checkout = await polar.checkouts.create({
      //biome-ignore lint:
      productPriceId: process.env.POLAR_PRODUCT_PRICE_ID!,
      successUrl: getUrl("/app?polar_checkout_id={CHECKOUT_ID}"),
      customerId: polarCustomerId as string,
      metadata: {
        userId: user.id,
      }
    })

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