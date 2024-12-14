import type { Request } from "express";

import path from "node:path";

import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: (_request: Request, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_request: Request, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuid()}`;

    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

export { storage };
