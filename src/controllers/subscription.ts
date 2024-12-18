import type { Request, Response } from "express";

import { Tier } from "@prisma/client";

import { env } from "../lib/env";
import { BadResponse, handleErrors } from "../lib/error";
import { stripe } from "../lib/stripe";
import {
  createCheckoutSession,
  createPortalSession,
} from "../services/subscription";
import { createCheckoutQuerySchema } from "../validators/subscription";

async function createCheckout(request: Request, response: Response) {
  try {
    const { tier } = createCheckoutQuerySchema.parse(request.query);

    let priceId: string;

    switch (tier) {
      case Tier.PRO:
        priceId = env.STRIPE_PRO_PRICE_ID;
        break;
      case Tier.PREMIUM:
        priceId = env.STRIPE_PREMIUM_PRICE_ID;
        break;
      default:
        throw new BadResponse("Invalid Tier");
    }

    const { session } = await createCheckoutSession({ priceId });

    // response.redirect(session.url);

    return response.created(
      {
        data: {
          sessionId: session.id,
          url: session.url,
        },
      },
      {
        message: "Checkout Session Created!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function createPortal(request: Request, response: Response) {
  try {
    const customerId = "cus_RPwJKpOopURtXt";

    if (!customerId) {
      throw new BadResponse("Customer Not Found!");
    }

    const { session } = await createPortalSession({ customerId });

    // response.redirect(session.url);

    return response.created(
      {
        data: {
          sessionId: session.id,
          url: session.url,
        },
      },
      {
        message: "Portal Session Created!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function stripeWebhook(request: Request, response: Response) {
  try {
    const sig = request.headers["stripe-signature"] as string;

    const event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET_KEY,
    );

    console.log({ event });
    console.log({ eventType: event.type });
    console.log({ eventData: event.data });

    switch (event.type) {
      case "checkout.session.completed":
        console.log("checkout.session.completed");
        // Handle checkout.session.completed
        break;
      case "customer.subscription.updated":
        console.log("customer.subscription.updated");
        // Handle customer.subscription.updated
        break;
      case "customer.subscription.deleted":
        console.log("customer.subscription.deleted");
        // Handle customer.subscription.deleted
        break;
      case "invoice.paid":
        console.log("invoice.paid");
        // Handle invoice.paid
        break;
      case "invoice.payment_failed":
        console.log("invoice.payment_failed");
        // Handle invoice.payment_failed
        break;
      default:
        console.log("Unhandled Event");
        break;
    }

    return response.success({}, { message: "Webhook Received!" });
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { createCheckout, createPortal, stripeWebhook };
