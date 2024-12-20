import { Router } from "express";

import { Role } from "@prisma/client";
import {
  createOneProfile,
  getOneProfile,
  updateOneProfile,
} from "../controllers/profile";
import { verifyRequest } from "../middlewares/auth";

const profileRouter = Router();

profileRouter.get(
  "/",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  getOneProfile,
);

profileRouter.post(
  "/",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  createOneProfile,
);

profileRouter.put(
  "/",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  updateOneProfile,
);

export { profileRouter };
