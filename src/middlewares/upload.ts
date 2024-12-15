import type { NextFunction, Request, Response } from "express";

import path from "node:path";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { v4 as uuid } from "uuid";

import { env } from "../lib/env";
import { BadResponse, handleErrors } from "../lib/error";
import { s3Client } from "../lib/s3";

const allowedTypesForFree = /jpeg|jpg|png|mp4|pdf/;
const allowedTypesForPremium = /jpeg|jpg|png|mp4|pdf|zip|rar/;

const allowedLimitsForFree = {
  fileSize: 1024 * 1024 * 10,
  files: 1,
};

const allowedLimitsForPremium = {
  fileSize: 1024 * 1024 * 50,
  files: 5,
};

async function s3Upload(
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
    storage: multer.memoryStorage(),
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

  upload(request, response, async (error: unknown) => {
    try {
      if (error) {
        if (error instanceof multer.MulterError) {
          throw new BadResponse("File size is too large");
        }

        throw error;
      }

      const files = request.files as Express.Multer.File[];

      const promises = files.map(async (file) => {
        file.filename = `${file.fieldname}-${uuid()}${path.extname(
          file.originalname,
        )}`;

        const command = new PutObjectCommand({
          Bucket: env.AWS_BUCKET,
          Key: file.filename,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        return s3Client.send(command);
      });

      await Promise.all(promises);

      next();
    } catch (error) {
      return handleErrors({ response, error });
    }
  });
}

export { s3Upload };
