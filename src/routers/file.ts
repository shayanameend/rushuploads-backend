import { Role } from "@prisma/client";
import { Router } from "express";

import {
  deleteFile,
  generateFileLink,
  getAllLinks,
  getAllMails,
  getExpiredFiles,
  getLink,
  getUserReceivedFiles,
  getUserSharedFiles,
  sendFileMail,
} from "../controllers/file";
import { verifyRequest } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const fileRouter = Router();

fileRouter.get(
  "/shared",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  getUserSharedFiles,
);

fileRouter.get(
  "/received",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  getUserReceivedFiles,
);

fileRouter.get(
  "/expired",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  getExpiredFiles,
);

fileRouter.get(
  "/links",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  getAllLinks,
);

fileRouter.get(
  "/mails",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  getAllMails,
);

fileRouter.get(
  "/link/:linkId",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  getLink,
);

fileRouter.post(
  "/link",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  upload,
  generateFileLink,
);

fileRouter.post(
  "/mail",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  upload,
  sendFileMail,
);

fileRouter.delete(
  "/:fileId",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  deleteFile,
);

export { fileRouter };
