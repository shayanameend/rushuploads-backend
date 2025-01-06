import { prisma } from "../lib/prisma";

export async function createReward(payload: {
  linkId: string;
}) {
  const reward = await prisma.reward.create({
    data: {
      link: {
        connect: {
          id: payload.linkId,
        },
      },
    },
  });

  return { reward };
}
