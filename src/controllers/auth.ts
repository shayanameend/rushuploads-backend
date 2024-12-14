import type { Request, Response } from "express";

import { OtpType } from "@prisma/client";
import argon from "argon2";

import { BadResponse, NotFoundResponse, handleErrors } from "../lib/error";
import { deleteOTPByUser, getOTPByUser, upsertOTP } from "../services/otp";
import { createUser, getUserByEmail, updateUserById } from "../services/user";
import { signToken } from "../utils/jwt";
import { sendOTP } from "../utils/mail";
import {
  signInSchema,
  signUpSchema,
  verifyOtpSchema,
} from "../validators/auth";

async function signUp(request: Request, response: Response) {
  try {
    const { email, password, role } = signUpSchema.parse(request.body);

    const { user: existingUser } = await getUserByEmail({ email, role });

    if (existingUser) {
      throw new BadResponse("User Already Exists!");
    }

    let hashedPassword: string | undefined;

    if (password) {
      hashedPassword = await argon.hash(password);
    }

    const { user } = await createUser({
      email,
      password: hashedPassword,
      role,
    });

    if (!user) {
      throw new NotFoundResponse("User not found!");
    }

    user.isVerified = user.password ? user.isVerified : false;

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const { otp } = await upsertOTP(
      { userId: user.id },
      { otpType: OtpType.VERIFY_EMAIL },
    );

    await sendOTP({
      to: user.email,
      subject: "Verify Email",
      code: `Your otp is: ${otp.code}`,
    });

    user.password = undefined;

    response.success(
      {
        data: { user, token },
      },
      {
        message: "Sign Up Successfull!",
      },
    );

    return;
  } catch (error) {
    handleErrors({ response, error });

    return;
  }
}

async function signIn(request: Request, response: Response) {
  try {
    const { email, password, role } = signInSchema.parse(request.body);

    const { user } = await getUserByEmail({ email, role });

    if (!user) {
      throw new NotFoundResponse("User Not Found!");
    }

    user.isVerified = user.password ? user.isVerified : false;

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    if (!user.password) {
      const { otp } = await upsertOTP(
        { userId: user.id },
        { otpType: OtpType.VERIFY_EMAIL },
      );

      await sendOTP({
        to: user.email,
        subject: "Verify Email",
        code: `Your otp is: ${otp.code}`,
      });

      user.password = undefined;

      response.success(
        {
          data: { user, token },
        },
        {
          message: "OTP Sent Successfully!",
        },
      );

      return;
    }

    const isPasswordValid = await argon.verify(user.password, password);

    if (!isPasswordValid) {
      throw new BadResponse("Invalid Password!");
    }

    if (!user.isVerified) {
      const { otp } = await upsertOTP(
        { userId: user.id },
        { otpType: OtpType.VERIFY_EMAIL },
      );

      await sendOTP({
        to: user.email,
        subject: "Verify Email",
        code: `Your otp is: ${otp.code}`,
      });

      user.password = undefined;

      response.success(
        {
          data: { user, token },
        },
        {
          message: "OTP Sent Successfully!",
        },
      );

      return;
    }

    user.password = undefined;

    response.success(
      {
        data: { user, token },
      },
      {
        message: "Sign In Successfull!",
      },
    );

    return;
  } catch (error) {
    handleErrors({ response, error });

    return;
  }
}

async function verifyOtp(request: Request, response: Response) {
  try {
    const { user } = request;

    const { otp, type } = verifyOtpSchema.parse(request.body);

    user.isVerified = true;

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const { otp: existingOtp } = await getOTPByUser({ userId: user.id, type });

    if (!existingOtp) {
      throw new BadResponse("Invalid OTP!");
    }

    if (existingOtp.code !== otp) {
      throw new BadResponse("Invalid OTP!");
    }

    if (type === OtpType.VERIFY_EMAIL) {
      await updateUserById({ id: user.id }, { isVerified: true });
    }

    await deleteOTPByUser({ userId: user.id, type });

    response.success(
      {
        data: { user, token },
      },
      {
        message: "OTP Verified Successfully!",
      },
    );

    return;
  } catch (error) {
    handleErrors({ response, error });

    return;
  }
}

export { signUp, signIn, verifyOtp };
