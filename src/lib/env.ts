import "dotenv/config";

import * as zod from "zod";

const envSchema = zod.object({
  NODE_ENV: zod.enum(["development", "production"]),
  PORT: zod.coerce.number().min(1000).max(9999),
  JWT_SECRET: zod.string(),
  JWT_EXPIRY: zod.string(),
  NODEMAILER_SERVICE: zod.string(),
  NODEMAILER_HOST: zod.string(),
  NODEMAILER_PORT: zod.coerce.number(),
  NODEMAILER_SECURE: zod.coerce.boolean(),
  NODEMAILER_EMAIL: zod.string().email(),
  NODEMAILER_PASSWORD: zod.string(),
  DATABASE_URL: zod.string().url(),
  CLIENT_BASE_URL: zod.string().url(),
  AWS_ACCESS_KEY_ID: zod.string(),
  AWS_SECRET_ACCESS_KEY: zod.string(),
  AWS_BUCKET: zod.string(),
  AWS_REGION: zod.string(),
  STRIPE_SECRET_KEY: zod.string(),
  STRIPE_WEBHOOK_SECRET_KEY: zod.string(),
  STRIPE_PRO_PRICE_ID: zod.string(),
  STRIPE_PREMIUM_PRICE_ID: zod.string(),
  STRIPE_SUCCESS_ENDPOINT: zod.string(),
  STRIPE_CANCEL_ENDPOINT: zod.string(),
});

export const env = envSchema.parse(process.env);
