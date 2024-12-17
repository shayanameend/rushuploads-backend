import { Role } from "@prisma/client";
import express, { Router } from "express";

import {
  createCheckoutSession,
  createPortalSession,
  stripeWebhook,
} from "../controllers/subscription";
import { verifyRequest } from "../middlewares/auth";

const subscriptionRouter = Router();

subscriptionRouter.post(
  "/checkout",
  verifyRequest({ isVerified: true, role: Role.USER }),
  createCheckoutSession,
);

subscriptionRouter.post(
  "/portal",
  verifyRequest({ isVerified: true, role: Role.USER }),
  createPortalSession,
);

subscriptionRouter.post(
  "/webhook",
  verifyRequest({ isVerified: true, role: Role.USER }),
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export { subscriptionRouter };
