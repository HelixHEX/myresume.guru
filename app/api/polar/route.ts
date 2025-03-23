import { updateDbWithLatestSubscriptionData } from "@/lib/polar";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
  //biome-ignore lint:Will fix later.
  onPayload: async (payload: any) => {
    console.log("[Polar][Webhook] Payload", payload);

    switch (payload.type) {
      case 'subscription.updated':
        await updateDbWithLatestSubscriptionData(payload.data.id)
        break
      default:
        console.log("[Polar][Webhook] Unknown event type", payload.type);
        break;
    }
  }
})