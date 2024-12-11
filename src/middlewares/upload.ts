import type { NextFunction, Request, Response } from "express";

import path from "node:path";

import multer from "multer";

import { BadResponse, handleErrors } from "../lib/error";
import { storage } from "../lib/multer";

const allowedTypesForFree = /jpeg|jpg|png|mp4|pdf/;
const allowedTypesForPremium = /jpeg|jpg|png|mp4|pdf|zip|rar/;

const allowedLimitsForFree = {
  fileSize: 1024 * 1024 * 5,
  files: 1,
};

const allowedLimitsForPremium = {
  fileSize: 1024 * 1024 * 25,
  files: 5,
};

async function localUpload(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const allowedTypes = request.user?.isVerified
    ? allowedTypesForPremium
    : allowedTypesForFree;

  const allowedLimits = request.user?.isVerified
    ? allowedLimitsForPremium
    : allowedLimitsForFree;

  const upload = multer({
    storage,
    limits: allowedLimits,
    fileFilter: (_request: Request, file, cb) => {
      try {
        const extname = allowedTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );

        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
          return cb(null, true);
        }

        return cb(new BadResponse("File not supported!"));
      } catch (error) {
        return handleErrors({ response, error });
      }
    },
  }).array("files");

  upload(request, response, (error: unknown) => {
    try {
      if (error) {
        if (error instanceof multer.MulterError) {
          throw new BadResponse("File size is too large");
        }

        throw error;
      }

      next();
    } catch (error) {
      return handleErrors({ response, error });
    }
  });
}

export { localUpload };
