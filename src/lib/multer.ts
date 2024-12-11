import type { Request } from "express";

import path from "node:path";

import multer from "multer";

const storage = multer.diskStorage({
  destination: (_request: Request, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_request: Request, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

export { storage };
