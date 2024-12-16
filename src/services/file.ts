import type { Prisma } from "@prisma/client";

import path from "node:path";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

import { env } from "../lib/env";
import { prisma } from "../lib/prisma";
import { s3Client } from "../lib/s3";

async function uploadFiles(payload: {
  rawFiles: Express.Multer.File[];
}) {
  return await Promise.all(
    payload.rawFiles.map(async (file) => {
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
    }),
  );
}

async function removeFile(payload: { key: string }) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: payload.key,
  });

  return await s3Client.send(deleteCommand);
}

async function getFilesByUserId(query: {
  userId: string;
  type?: string;
}) {
  const files = await prisma.file.findMany({
    where: {
      userId: query.userId,
      type: query.type,
      isDeleted: false,
    },
    select: {
      id: true,
      originalName: true,
      name: true,
      type: true,
      isExpired: true,
      expiredAt: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return { files };
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
          isExpired: true,
          expiredAt: true,
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

async function updateFileById(
  query: {
    fileId: string;
    userId: string;
    type?: string;
  },
  payload: Prisma.FileUpdateInput,
) {
  const file = await prisma.file.update({
    where: {
      id: query.fileId,
      userId: query.userId,
      type: query.type,
    },
    data: payload,
    select: {
      id: true,
      originalName: true,
      name: true,
      type: true,
      isExpired: true,
      expiredAt: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return { file };
}

export {
  uploadFiles,
  removeFile,
  getFilesByUserId,
  createFiles,
  updateFileById,
};
