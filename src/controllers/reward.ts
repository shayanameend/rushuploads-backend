import type { Request, Response } from "express";

import { env } from "../lib/env";
import { BadResponse, handleErrors } from "../lib/error";
import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";
import {
  redeemRewardBodySchema,
  redeemRewardParamsSchema,
} from "../validators/reward";

export async function createOnboard(request: Request, response: Response) {
  try {
    const { id } = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: request.user.email,
    });

    await prisma.user.update({
      where: {
        id: request.user.id,
      },
      data: {
        accountId: id,
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: id,
      refresh_url: `${env.CLIENT_BASE_URL}${env.STRIPE_RETURN_ENDPOINT}`,
      return_url: `${env.CLIENT_BASE_URL}${env.STRIPE_RETURN_ENDPOINT}`,
      type: "account_onboarding",
    });

    return response.created(
      {
        data: {
          url: accountLink.url,
        },
      },
      {
        message: "Onboard Session Created!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export async function redeemReward(request: Request, response: Response) {
  try {
    const { linkId } = redeemRewardParamsSchema.parse(request.params);
    const { amountInCents } = redeemRewardBodySchema.parse(request.body);

    const rewards = await prisma.reward.findMany({
      where: {
        linkId,
      },
    });

    const rewardsTotal = rewards.reduce((acc, reward) => acc + 1, 0);

    if (rewardsTotal < amountInCents) {
      throw new BadResponse("Insufficient Rewards!");
    }

    const deletedRewards: unknown[] = [];

    for (let i = 0; i < amountInCents; i++) {
      const reward = rewards[i];

      deletedRewards.push(
        prisma.reward.delete({
          where: {
            id: reward.id,
          },
        }),
      );
    }

    const { accountId } = await prisma.user.findUnique({
      where: {
        id: request.user.id,
      },
    });

    if (!accountId) {
      throw new BadResponse("Account Not Found!");
    }

    await stripe.transfers.create({
      amount: amountInCents,
      currency: "usd",
      destination: accountId,
    });

    await Promise.all(deletedRewards);

    return response.success(
      {},
      {
        message: "Rewards Redeemed!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}
