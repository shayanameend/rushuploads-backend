import { Role } from "@prisma/client";
import { Router } from "express";

import { uploadFiles } from "../controllers/file";
import { verifyRequest } from "../middlewares/auth";
import { multerUpload } from "../middlewares/upload";

const fileRouter = Router();

fileRouter.post(
  "/upload",
  verifyRequest({ isVerified: true, role: Role.USER }),
  multerUpload,
  uploadFiles,
);

export { fileRouter };
