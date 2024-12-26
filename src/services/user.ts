import { type Prisma, Role } from "@prisma/client";

import { TierConstraints } from "../constants/tiers";
import { prisma } from "../lib/prisma";

async function getUserById(query: { id: string; role?: Role }) {
  const user = await prisma.user.findUnique({
    where: {
      id: query.id,
      role: query.role,
      isDeleted: false,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      tier: true,
      totalStorage: true,
      usedStorage: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  return {
    user: { ...user, transferLimit: TierConstraints[user.tier].maxSendSize },
  };
}

async function getUserByEmail(query: { email: string; role?: Role }) {
  const user = await prisma.user.findUnique({
    where: {
      email: query.email,
      role: query.role,
      isDeleted: false,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      tier: true,
      totalStorage: true,
      usedStorage: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  return {
    user: { ...user, transferLimit: TierConstraints[user.tier].maxSendSize },
  };
}

async function getUsers(
  query: {
    text?: string;
    role?: Role;
    isVerified?: boolean;
    isDeleted?: boolean;
    skip?: number;
    take?: number;
  } = {
    role: Role.USER,
    skip: 0,
    take: 10,
  },
) {
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: query.text,
      },
      role: query.role,
      isVerified: query.isVerified,
      isDeleted: query.isDeleted,
    },
    select: {
      id: true,
      email: true,
      role: true,
      tier: true,
      totalStorage: true,
      usedStorage: true,
      isVerified: true,
      updatedAt: true,
    },
    skip: query.skip,
    take: query.take,
  });

  return { users };
}

async function createUser(payload: {
  email: string;
  password?: string;
  role?: Role;
}) {
  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: payload.password,
      role: payload.role,
      totalStorage: TierConstraints.FREE.maxStorage,
      usedStorage: 0,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      tier: true,
      totalStorage: true,
      usedStorage: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  return {
    user: { ...user, transferLimit: TierConstraints[user.tier].maxSendSize },
  };
}

async function updateUserById(
  query: { id: string; role?: Role },
  payload: Prisma.UserUpdateInput,
) {
  const user = await prisma.user.update({
    where: {
      id: query.id,
      role: query.role,
      isDeleted: false,
    },
    data: payload,
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      tier: true,
      totalStorage: true,
      usedStorage: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  return {
    user: { ...user, transferLimit: TierConstraints[user.tier].maxSendSize },
  };
}

async function updateUserByEmail(
  query: { email: string; role?: Role },
  payload: Prisma.UserUpdateInput,
) {
  const user = await prisma.user.update({
    where: {
      email: query.email,
      role: query.role,
      isDeleted: false,
    },
    data: payload,
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      tier: true,
      totalStorage: true,
      usedStorage: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  return {
    user: { ...user, transferLimit: TierConstraints[user.tier].maxSendSize },
  };
}

async function upsertUserByEmail(
  query: { email: string; role?: Role },
  payload: Prisma.UserUpdateInput,
) {
  const user = await prisma.user.upsert({
    where: {
      email: query.email,
      role: query.role,
    },
    update: payload,
    create: {
      email: query.email,
      role: query.role,
      totalStorage: TierConstraints.FREE.maxStorage,
      usedStorage: 0,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      tier: true,
      totalStorage: true,
      usedStorage: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  return {
    user: { ...user, transferLimit: TierConstraints[user.tier].maxSendSize },
  };
}

async function deleteUserById(query: { id: string; role?: Role }) {
  const { user } = await updateUserById(query, {
    isDeleted: true,
  });

  return {
    user: { ...user, transferLimit: TierConstraints[user.tier].maxSendSize },
  };
}

async function deleteUserByEmail(query: { email: string; role?: Role }) {
  const { user } = await updateUserByEmail(query, {
    isDeleted: true,
  });

  return {
    user: { ...user, transferLimit: TierConstraints[user.tier].maxSendSize },
  };
}

export {
  getUserById,
  getUserByEmail,
  getUsers,
  createUser,
  updateUserById,
  updateUserByEmail,
  upsertUserByEmail,
  deleteUserById,
  deleteUserByEmail,
};
