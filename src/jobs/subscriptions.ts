import { SubscriptionStatus, Tier } from "@prisma/client";

import { TierConstraints } from "../constants/tiers";
import { prisma } from "../lib/prisma";

async function downgradePastDueSubscriptions() {
  const now = new Date();
  now.setDate(now.getDate() + 7);

  const pastDueSubscriptions = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.PAST_DUE,
      currentPeriodEnd: {
        lte: now,
      },
    },
  });

  for (const subscription of pastDueSubscriptions) {
    await prisma.user.update({
      where: {
        id: subscription.userId,
      },
      data: {
        tier: Tier.FREE,
        totalStorage: TierConstraints[Tier.FREE].maxStorage,
      },
    });
  }

  for (const subscription of pastDueSubscriptions) {
    await prisma.file.updateMany({
      where: {
        userId: subscription.userId,
        isExpired: false,
      },
      data: {
        isExpired: true,
      },
    });
  }
}

async function downgradeCancelledSubscriptions() {
  const now = new Date();

  const canceledSubscriptions = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.CANCELED,
      currentPeriodEnd: {
        lte: now,
      },
    },
  });

  for (const subscription of canceledSubscriptions) {
    await prisma.user.update({
      where: {
        id: subscription.userId,
      },
      data: {
        tier: Tier.FREE,
        totalStorage: TierConstraints[Tier.FREE].maxStorage,
      },
    });
  }

  for (const subscription of canceledSubscriptions) {
    await prisma.file.updateMany({
      where: {
        userId: subscription.userId,
        isExpired: false,
      },
      data: {
        isExpired: true,
      },
    });
  }
}

export { downgradePastDueSubscriptions, downgradeCancelledSubscriptions };
