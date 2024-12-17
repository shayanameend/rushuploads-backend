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
  express.json(),
  express.urlencoded({ extended: true }),
  verifyRequest({ isVerified: true, role: Role.USER }),
  createCheckoutSession,
);

subscriptionRouter.post(
  "/portal",
  express.json(),
  express.urlencoded({ extended: true }),
  verifyRequest({ isVerified: true, role: Role.USER }),
  createPortalSession,
);

subscriptionRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export { subscriptionRouter };
