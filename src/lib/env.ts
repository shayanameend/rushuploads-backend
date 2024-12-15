import "dotenv/config";

import * as zod from "zod";

const envSchema = zod.object({
  NODE_ENV: zod.enum(["development", "production"]),
  PORT: zod.string().length(4),
  JWT_SECRET: zod.string(),
  JWT_EXPIRY: zod.string(),
  NODEMAILER_EMAIL: zod.string().email(),
  NODEMAILER_PASSWORD: zod.string(),
  DATABASE_URL: zod.string().url(),
  AWS_ACCESS_KEY_ID: zod.string(),
  AWS_SECRET_ACCESS_KEY: zod.string(),
  AWS_BUCKET: zod.string(),
  AWS_REGION: zod.string(),
  FREE_TIER_SIZE_LIMIT_MB: zod.coerce.number(),
  PRO_TIER_SIZE_LIMIT_MB: zod.coerce.number(),
  PREMIUM_TIER_SIZE_LIMIT_MB: zod.coerce.number(),
  FREE_TIER_EXPIRY_LIMIT_DAYS: zod.coerce.number(),
  PRO_TIER_EXPIRY_LIMIT_DAYS: zod.coerce.number(),
  PREMIUM_TIER_EXPIRY_LIMIT_DAYS: zod.coerce.number(),
});

export const env = envSchema.parse(process.env);
