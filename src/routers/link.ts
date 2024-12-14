import { Role } from "@prisma/client";
import { Router } from "express";

import { generateLink } from "../controllers/link";
import { verifyRequest } from "../middlewares/auth";

const linkRouter = Router();

linkRouter.post(
  "/",
  verifyRequest({ isVerified: true, role: Role.USER }),
  generateLink,
);

export { linkRouter };
