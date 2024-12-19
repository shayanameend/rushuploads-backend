import { Tier } from "@prisma/client";
import * as zod from "zod";

const createCheckoutQuerySchema = zod.object({
  tier: zod.enum([Tier.PRO, Tier.PREMIUM]),
});

export { createCheckoutQuerySchema };
