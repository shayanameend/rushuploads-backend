import { Role } from "@prisma/client";
import { Router } from "express";

import { generateFileLink, sendFileMail } from "../controllers/file";
import { verifyRequest } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const fileRouter = Router();

fileRouter.post(
  "/link",
  verifyRequest({ isVerified: true, role: Role.USER }),
  upload,
  generateFileLink,
);

fileRouter.post(
  "/mail",
  verifyRequest({ isVerified: true, role: Role.USER }),
  upload,
  sendFileMail,
);

export { fileRouter };
