import { Router } from "express";
import { Role } from "@prisma/client";

import { getAllUsers } from "../controllers/user";
import { verifyRequest } from "../middlewares/auth";

const userRouter = Router();

userRouter.get(
  "/all",
  verifyRequest({ isVerified: true, role: Role.ADMIN }),
  getAllUsers,
);

export { userRouter };
