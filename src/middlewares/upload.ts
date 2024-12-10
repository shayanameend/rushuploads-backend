import type { NextFunction, Request, Response } from "express";

import path from "node:path";

import multer from "multer";

import { BadResponse, handleErrors } from "../lib/error";
import { storage } from "../lib/multer";

const freeFileLimits = {
  fileSize: 1024 * 1024 * 25,
  files: 3,
};

const premiumFileLimits = {
  fileSize: 1024 * 1024 * 250,
  files: 5,
};

const freeAllowedTypes = /jpeg|jpg|png|mp4|pdf/;
const premiumAllowedTypes = /jpeg|jpg|png|mp4|pdf|zip|rar/;

function getFileLimits(request: Request) {
  return request.user?.isVerified ? premiumFileLimits : freeFileLimits;
}

function getAllowedTypes(request: Request) {
  return request.user?.isVerified ? premiumAllowedTypes : freeAllowedTypes;
}

function fileFilter(
  request: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const allowedTypes = getAllowedTypes(request);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  const message = request.user?.isVerified
    ? "File not supported!"
    : "File type or size not supported for free users!";
  cb(new BadResponse(message));
}

function multerUpload(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const limits = getFileLimits(request);
  const multerUpload = multer({
    storage: storage,
    limits: limits,
    fileFilter: (req, file, cb) => fileFilter(req, file, cb),
  }).array("files", limits.files);

  multerUpload(request, response, (error: unknown) => {
    handleErrors(response, error);

    next();
  });
}

export { multerUpload };
