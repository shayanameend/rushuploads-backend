import type { Prisma, Role } from "@prisma/client";

import { prisma } from "../lib/prisma";

async function createUser(payload: Prisma.UserCreateInput) {
  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: payload.password,
      role: payload.role,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { user };
}

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
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { user };
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
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { user };
}

async function getUsers(
  query: { role?: Role; skip: number; take: number } = {
    role: "USER",
    skip: 0,
    take: 10,
  },
) {
  const users = await prisma.user.findMany({
    where: {
      role: query.role,
      isDeleted: false,
    },
    skip: query.skip,
    take: query.take,
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { users };
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
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { user };
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
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { user };
}

async function deleteUserById(query: { id: string; role?: Role }) {
  const { user } = await updateUserById(query, {
    isDeleted: true,
  });

  return { user };
}

async function deleteUserByEmail(query: { email: string; role?: Role }) {
  const { user } = await updateUserByEmail(query, {
    isDeleted: true,
  });

  return { user };
}

export {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
  updateUserById,
  updateUserByEmail,
  deleteUserById,
  deleteUserByEmail,
};
