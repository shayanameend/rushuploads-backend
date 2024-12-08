import { Role } from "@prisma/client";
import * as zod from "zod";

const getAllUsersSchema = zod.object({
  text: zod
    .string({
      message: "Text must be a string",
    })
    .optional(),
  role: zod
    .enum([Role.USER, Role.ADMIN], {
      message: "Role must be either 'USER' or 'ADMIN'",
    })
    .optional(),
  isVerified: zod
    .boolean({
      message: "Is Verified must be a boolean",
    })
    .optional(),
  isDeleted: zod
    .boolean({
      message: "Is Deleted must be a boolean",
    })
    .optional(),
  page: zod.coerce
    .number({
      message: "Page must be a number",
    })
    .min(1, {
      message: "Page must be greater than or equal to 1",
    })
    .optional(),
  limit: zod.coerce
    .number({
      message: "Limit must be a number",
    })
    .min(1, {
      message: "Limit must be greater than or equal to 1",
    })
    .optional(),
});

const getOneUserSchema = zod.object({
  userId: zod.string({
    message: "User ID must be a string",
  }),
});

const deleteOneUserSchema = zod.object({
  userId: zod.string({
    message: "User ID must be a string",
  }),
});

export { getAllUsersSchema, getOneUserSchema, deleteOneUserSchema };
