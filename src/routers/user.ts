import { Role } from "@prisma/client";
import { Router } from "express";

import { getAllUsers, getOneUser } from "../controllers/user";
import { verifyRequest } from "../middlewares/auth";

const userRouter = Router();

userRouter.get(
  "/all",
  verifyRequest({ isVerified: true, role: Role.ADMIN }),
  getAllUsers,
);

userRouter.get(
  "/one",
  verifyRequest({ isVerified: true, role: Role.ADMIN }),
  getOneUser,
);

export { userRouter };
