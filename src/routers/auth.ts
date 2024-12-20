import { Router } from "express";

import {
  resetPassword,
  signIn,
  signUp,
  updatePassword,
  verifyOtp,
} from "../controllers/auth";
import { verifyRequest } from "../middlewares/auth";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/reset-password", resetPassword);

authRouter.post(
  "/verify-otp",
  verifyRequest({
    isVerified: false,
  }),
  verifyOtp,
);

authRouter.post(
  "/update-password",
  verifyRequest({
    isVerified: true,
  }),
  updatePassword,
);

export { authRouter };
