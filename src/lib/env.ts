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
});

export const env = envSchema.parse(process.env);
