import { Tier } from "@prisma/client";
import * as zod from "zod";

const createOneProfileBodySchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
});

const updateOneProfileBodySchema = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

export { createOneProfileBodySchema, updateOneProfileBodySchema };
