import type Stripe from "stripe";

import { SubscriptionStatus } from "@prisma/client";

import { PriceIdToTierMap, TierConstraints } from "../constants/tiers";
import { env } from "../lib/env";
import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";

async function getSubscriptionByUserId(query: { userId: string }) {
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId: query.userId,
    },
    select: {
      id: true,
      customerId: true,
      subscriptionId: true,
      priceId: true,
      status: true,
      currentPeriodEnd: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return { subscription };
}

async function createCheckoutSession(payload: {
  userId: string;
  priceId: string;
}) {
  if (!payload.userId && !payload.priceId) {
    console.log({ payload });

    throw new Error("Missing Required Fields!");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: payload.priceId,
        quantity: 1,
      },
    ],
    success_url: `${env.CLIENT_BASE_URL}${env.STRIPE_SUCCESS_ENDPOINT}`,
    cancel_url: `${env.CLIENT_BASE_URL}${env.STRIPE_CANCEL_ENDPOINT}`,
    client_reference_id: payload.userId,
  });

  return { session };
}

async function createPortalSession(payload: { customerId: string }) {
  if (!payload.customerId) {
    console.log({ payload });

    throw new Error("Missing Required Fields!");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: payload.customerId,
    return_url: `${env.CLIENT_BASE_URL}${env.STRIPE_RETURN_ENDPOINT}`,
  });

  return { session };
}

async function handleSubscriptionCreated({
  event,
}: {
  event: Stripe.CustomerSubscriptionCreatedEvent;
}) {
  const subscription = event.data.object;

  const userId = subscription.metadata.userId;
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const priceId = subscription.items.data[0].price.id;

  if (!userId && !customerId && !subscriptionId && !priceId) {
    console.log({ userId, customerId, subscriptionId, priceId });

    throw new Error("Missing Required Fields!");
  }

  await prisma.subscription.create({
    data: {
      subscriptionId,
      customerId,
      priceId,
      status: SubscriptionStatus.PAST_DUE,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

async function handlePaymentSuccess({
  event,
}: { event: Stripe.InvoicePaymentSucceededEvent }) {
  const invoice = event.data.object;

  const subscriptionId = invoice.subscription as string;
  const priceId = invoice.lines.data[0].price.id;

  if (!subscriptionId && !priceId) {
    console.log({ subscriptionId, priceId });

    throw new Error("Missing Required Fields!");
  }

  const tier = PriceIdToTierMap[priceId];
  const totalStorage = TierConstraints[tier].maxStorage;

  const subscription = await prisma.subscription.update({
    where: {
      subscriptionId,
    },
    data: {
      status: SubscriptionStatus.ACTIVE,
    },
  });

  await prisma.user.update({
    where: {
      id: subscription.userId,
    },
    data: {
      tier,
      totalStorage,
    },
  });
}

async function handlePaymentFailure({
  event,
}: { event: Stripe.InvoicePaymentFailedEvent }) {
  const invoice = event.data.object;

  const subscriptionId = invoice.subscription as string;

  if (subscriptionId) {
    console.log({ subscriptionId });

    throw new Error("Missing Required Fields!");
  }

  await prisma.subscription.update({
    where: {
      subscriptionId,
    },
    data: {
      status: SubscriptionStatus.PAST_DUE,
    },
  });
}

async function handleSubscriptionUpdated({
  event,
}: { event: Stripe.CustomerSubscriptionUpdatedEvent }) {
  const subscription = event.data.object;

  const subscriptionId = subscription.id;

  if (!subscriptionId) {
    console.log({ subscriptionId });

    throw new Error("Missing Required Fields!");
  }

  switch (subscription.status) {
    case "canceled":
      await prisma.subscription.update({
        where: {
          subscriptionId,
        },
        data: {
          status: SubscriptionStatus.CANCELED,
        },
      });
      break;
    default:
      await prisma.subscription.update({
        where: {
          subscriptionId,
        },
        data: {
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      break;
  }
}

export {
  getSubscriptionByUserId,
  createCheckoutSession,
  createPortalSession,
  handleSubscriptionCreated,
  handlePaymentSuccess,
  handlePaymentFailure,
  handleSubscriptionUpdated,
};
