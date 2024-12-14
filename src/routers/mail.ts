import { Role } from "@prisma/client";
import { Router } from "express";

import { sendMail } from "../controllers/mail";
import { verifyRequest } from "../middlewares/auth";

const mailRouter = Router();

mailRouter.post(
  "/send",
  verifyRequest({ isVerified: true, role: Role.USER }),
  sendMail,
);

export { mailRouter };
