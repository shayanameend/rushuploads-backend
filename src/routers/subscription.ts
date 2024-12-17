import { Role } from "@prisma/client";
import express, { Router } from "express";

import {
  getCheckoutSession,
  getPortalSession,
  stripeWebhook,
} from "../controllers/subscription";
import { verifyRequest } from "../middlewares/auth";

const subscriptionRouter = Router();

subscriptionRouter.get(
  "/checkout",
  verifyRequest({ isVerified: true, role: Role.USER }),
  getCheckoutSession,
);

subscriptionRouter.get(
  "/portal",
  verifyRequest({ isVerified: true, role: Role.USER }),
  getPortalSession,
);

subscriptionRouter.post(
  "/webhook",
  verifyRequest({ isVerified: true, role: Role.USER }),
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export { subscriptionRouter };
