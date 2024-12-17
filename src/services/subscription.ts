import { env } from "../lib/env";
import { stripe } from "../lib/stripe";

async function createCheckoutSession(payload: { priceId: string }) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: payload.priceId,
        quantity: 1,
      },
    ],
    success_url: `${env.CLIENT_BASE_URL}/${env.STRIPE_SUCCESS_ENDPOINT}`,
    cancel_url: `${env.CLIENT_BASE_URL}/${env.STRIPE_CANCEL_ENDPOINT}`,
  });

  return { session };
}

async function createPortalSession(payload: { customerId: string }) {
  const session = await stripe.billingPortal.sessions.create({
    customer: payload.customerId,
    return_url: env.CLIENT_BASE_URL,
  });

  return { session };
}

export { createCheckoutSession, createPortalSession };
