import { Tier } from "@prisma/client";
import * as zod from "zod";

const getCheckoutSessionQuerySchema = zod.object({
  tier: zod.enum([Tier.PRO, Tier.PREMIUM]),
});

const getPortalSessionQuerySchema = zod.object({
  customerId: zod.string(),
});

export { getCheckoutSessionQuerySchema, getPortalSessionQuerySchema };
