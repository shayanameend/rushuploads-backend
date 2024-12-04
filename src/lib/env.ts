import "dotenv/config";

import * as zod from "zod";

const envSchema = zod.object({
  NODE_ENV: zod.enum(["development", "production"]),
  PORT: zod.string().length(4),
  DATABASE_URL: zod.string().url(),
});

export const env = envSchema.parse(process.env);
