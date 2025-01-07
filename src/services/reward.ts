import type { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";

export async function getRewardByIpAndLinkId(query: {
  ip: string;
  linkId: string;
}) {
  const reward = await prisma.reward.findUnique({
    where: {
      ip: query.ip,
      linkId: query.linkId,
    },
  });

  return { reward };
}

export async function createReward(payload: {
  ip: string;
  linkId: string;
}) {
  const reward = await prisma.reward.create({
    data: {
      ip: payload.ip,
      link: {
        connect: {
          id: payload.linkId,
        },
      },
    },
  });

  return { reward };
}

export async function updateReward(
  query: {
    id: string;
  },
  payload: Prisma.RewardUpdateInput,
) {
  const reward = await prisma.reward.update({
    where: {
      id: query.id,
    },
    data: payload,
  });

  return { reward };
}
