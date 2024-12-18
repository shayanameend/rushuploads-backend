import { Role } from "@prisma/client";
import express, { Router } from "express";

import {
  createCheckout,
  createPortal,
  stripeWebhook,
} from "../controllers/subscription";
import { verifyRequest } from "../middlewares/auth";

const subscriptionRouter = Router();

subscriptionRouter.post(
  "/checkout",
  verifyRequest({ isVerified: true, role: Role.USER }),
  createCheckout,
);

subscriptionRouter.post(
  "/portal",
  verifyRequest({ isVerified: true, role: Role.USER }),
  createPortal,
);

subscriptionRouter.post("/webhook", stripeWebhook);

export { subscriptionRouter };
