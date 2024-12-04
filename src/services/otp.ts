import type { OtpType } from "@prisma/client";

import { prisma } from "../lib/prisma";

async function createOTP(data: { userId: string; otpType: OtpType }) {
  const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += sampleSpace[Math.floor(Math.random() * sampleSpace.length)];
  }

  const otp = await prisma.otp.create({
    data: {
      userId: data.userId,
      code,
      type: data.otpType,
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

export { createOTP };
