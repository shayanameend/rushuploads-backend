import { Tier } from "@prisma/client";
import * as zod from "zod";

const createCheckoutSessionQuerySchema = zod.object({
  tier: zod.enum([Tier.PRO, Tier.PREMIUM]),
});

const createPortalSessionQuerySchema = zod.object({
  customerId: zod.string(),
});

export { createCheckoutSessionQuerySchema, createPortalSessionQuerySchema };
