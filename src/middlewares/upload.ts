import type { NextFunction, Request, Response } from "express";

const freeFileLimits = {
  fileSize: 1024 * 1024 * 1,
  files: 3,
};

const premiumFileLimits = {
  fileSize: 0,
  files: 5,
};

const freeAllowedTypes = /jpeg|jpg|png|mp4|pdf/;
const premiumAllowedTypes = /jpeg|jpg|png|mp4|pdf|zip|rar/;

function localUpload(
  request: Request,
  response: Response,
  next: NextFunction,
) {}

export { localUpload };
