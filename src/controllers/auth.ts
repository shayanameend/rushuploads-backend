import type { Request, Response } from "express";

import { OtpType } from "@prisma/client";
import argon from "argon2";

import { deleteOTPByUser, getOTPByUser, upsertOTP } from "../services/otp";
import { createUser, getUserByEmail, updateUserById } from "../services/user";

async function signUp(request: Request, response: Response) {
  try {
    const { email, password, role } = request.body;

    const { user: existingUser } = await getUserByEmail({ email, role });

    if (existingUser) {
      throw new Error("User Already Exists!");
    }

    const hashedPassword = await argon.hash(password);

    const { user } = await createUser({
      email,
      password: hashedPassword,
      role,
    });

    if (!user) {
      throw new Error("User not found!");
    }

    const { otp } = await upsertOTP(
      { userId: user.id },
      { otpType: OtpType.VERIFY_EMAIL },
    );

    user.password = undefined;

    response.status(200).json({
      data: { user },
      message: "Sign Up Successfull!",
    });

    return;
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });

    return;
  }
}

async function signIn(request: Request, response: Response) {
  try {
    const { email, password, role } = request.body;

    const { user } = await getUserByEmail({ email, role });

    if (!user) {
      throw new Error("User Not Found!");
    }

    if (!user.password) {
      const { otp } = await upsertOTP(
        { userId: user.id },
        { otpType: OtpType.VERIFY_EMAIL },
      );

      user.password = undefined;

      response.status(200).json({
        data: { user },
        message: "OTP Sent Successfully!",
      });

      return;
    }

    const isPasswordValid = await argon.verify(user.password, password);

    if (!isPasswordValid) {
      throw new Error("Invalid Password!");
    }

    if (!user.isVerified) {
      const { otp } = await upsertOTP(
        { userId: user.id },
        { otpType: OtpType.VERIFY_EMAIL },
      );

      user.password = undefined;

      response.status(200).json({
        data: { user },
        message: "OTP Sent Successfully!",
      });

      return;
    }

    user.password = undefined;

    response.status(200).json({
      data: { user },
      message: "Sign In Successfull!",
    });

    return;
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });

    return;
  }
}

async function verifyOtp(request: Request, response: Response) {
  try {
    const { user } = request;

    const { otp, type } = request.body;

    const { otp: existingOtp } = await getOTPByUser({ userId: user.id, type });

    if (!existingOtp) {
      throw new Error("Invalid OTP!");
    }

    if (existingOtp.code !== otp) {
      throw new Error("Invalid OTP!");
    }

    if (type === OtpType.VERIFY_EMAIL) {
      if (user.isVerified) {
        throw new Error("User Already Verified!");
      }

      await updateUserById({ id: user.id }, { isVerified: true });
    }

    await deleteOTPByUser({ userId: user.id, type });

    response.status(200).json({
      message: "OTP Verified Successfully!",
    });

    return;
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });

    return;
  }
}

export { signUp, signIn, verifyOtp };
