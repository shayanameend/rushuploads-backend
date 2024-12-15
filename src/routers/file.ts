import { Role } from "@prisma/client";
import { Router } from "express";

import { uploadFiles } from "../controllers/file";
import { verifyRequest } from "../middlewares/auth";
import { s3Upload } from "../middlewares/upload";

const fileRouter = Router();

fileRouter.post(
  "/upload",
  verifyRequest({ isVerified: true, role: Role.USER }),
  s3Upload,
  uploadFiles,
);

export { fileRouter };
