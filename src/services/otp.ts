import type { OtpType } from "@prisma/client";

import { prisma } from "../lib/prisma";

async function upsertOTP(payload: { userId: string; otpType: OtpType }) {
  const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += sampleSpace[Math.floor(Math.random() * sampleSpace.length)];
  }

  const otp = await prisma.otp.upsert({
    where: {
      userId: payload.userId,
    },
    create: {
      userId: payload.userId,
      code,
      type: payload.otpType,
    },
    update: {
      code,
      type: payload.otpType,
    },
    select: {
      id: true,
      code: true,
      type: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return { otp };
}

export { upsertOTP };
