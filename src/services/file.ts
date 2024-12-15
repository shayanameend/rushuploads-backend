import path from "node:path";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

import { env } from "../lib/env";
import { prisma } from "../lib/prisma";
import { s3Client } from "../lib/s3";

async function uploadFiles(payload: {
  rawFiles: Express.Multer.File[];
}) {
  const promises = payload.rawFiles.map(async (file) => {
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
}

async function createFiles(payload: {
  userId: string;
  expiresAt: Date;
  rawFiles: Express.Multer.File[];
}) {
  const files = await prisma.$transaction(
    payload.rawFiles.map((file) =>
      prisma.file.create({
        data: {
          originalName: file.originalname,
          name: file.filename,
          type: file.mimetype,
          expiredAt: payload.expiresAt,
          user: {
            connect: {
              id: payload.userId,
            },
          },
        },
        select: {
          id: true,
          originalName: true,
          name: true,
          type: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      }),
    ),
  );

  return { files };
}

export { uploadFiles, createFiles };
