import type { Role } from "@prisma/client";

import { prisma } from "../lib/prisma";

async function createUser(data: {
  email: string;
  password?: string;
  role: Role;
}) {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      role: data.role,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { user };
}

export { createUser };
