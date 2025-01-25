import { Role } from "@prisma/client";
import { Router } from "express";

import {
  deleteFile,
  finalizeMultipartUpload,
  generateFileLink,
  getLink,
  getUserReceivedFiles,
  getUserSharedFiles,
  sendFileMail,
  startMultipartUpload,
  uploadChunk,
} from "../controllers/file";
import { verifyRequest } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const fileRouter = Router();

fileRouter.post(
  "/start",
  verifyRequest({ isVerified: true, role: Role.USER }),
  startMultipartUpload,
);

fileRouter.post(
  "/upload",
  verifyRequest({ isVerified: true, role: Role.USER }),
  upload,
  uploadChunk,
);

fileRouter.post(
  "/finalize",
  verifyRequest({ isVerified: true, role: Role.USER }),
  finalizeMultipartUpload,
);

fileRouter.get(
  "/shared",
  verifyRequest({ isVerified: true, role: Role.USER }),
  getUserSharedFiles,
);

fileRouter.get(
  "/received",
  verifyRequest({ isVerified: true, role: Role.USER }),
  getUserReceivedFiles,
);

fileRouter.get("/link/:linkId", getLink);

fileRouter.post(
  "/link",
  verifyRequest({ isVerified: true, role: Role.USER }),
  generateFileLink,
);

fileRouter.post(
  "/mail",
  verifyRequest({ isVerified: true, role: Role.USER }),
  sendFileMail,
);

fileRouter.delete(
  "/:fileId",
  verifyRequest({ isVerified: true, role: Role.USER }),
  deleteFile,
);

export { fileRouter };
