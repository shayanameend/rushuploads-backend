import type { Request, Response } from "express";

import { OtpType } from "@prisma/client";

import { createOTP } from "../services/otp";
import { createUser } from "../services/user";

async function signUp(request: Request, response: Response) {
  const { email, password, role } = request.body;

  const { user } = await createUser({ email, password, role });

  const { otp } = await createOTP({
    userId: user.id,
    otpType: OtpType.VERIFY_EMAIL,
  });

  response.json({ data: { user, otp } });
}

export { signUp };
