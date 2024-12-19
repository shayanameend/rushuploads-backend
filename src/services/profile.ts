import type { Prisma, Role } from "@prisma/client";

import { prisma } from "../lib/prisma";

async function getProfileByUserId(query: { userId: string }) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: query.userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return { profile };
}

async function createProfile(payload: {
  userId: string;
  firstName: string;
  lastName: string;
}) {
  const profile = await prisma.profile.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      user: {
        connect: {
          id: payload.userId,
        },
      },
    },
  });

  return { profile };
}

async function updateProfile(
  query: {
    userId: string;
  },
  payload: Prisma.ProfileUpdateInput,
) {
  const profile = await prisma.profile.update({
    where: {
      userId: query.userId,
    },
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
    },
  });

  return { profile };
}

export { getProfileByUserId, createProfile, updateProfile };
