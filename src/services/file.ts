import type { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";

async function createFile(payload: Prisma.FileCreateInput) {
  const file = await prisma.file.create({
    data: payload,
    select: {
      id: true,
      name: true,
      type: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return { file };
}

async function createFiles(payload: {
  userId: string;
  rawFiles: Express.Multer.File[];
}) {
  const files = await prisma.$transaction(
    payload.rawFiles.map((file) =>
      prisma.file.create({
        data: {
          name: file.filename,
          type: file.mimetype,
          userId: payload.userId,
        },
      }),
    ),
  );

  return { files };
}

async function getFileById(query: { id: string; type?: string }) {
  const file = await prisma.file.findUnique({
    where: {
      id: query.id,
      type: query.type,
    },
    select: {
      id: true,
      name: true,
      type: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return { file };
}

async function getFilesByUserId(query: { userId: string; type?: string }) {
  const files = await prisma.file.findMany({
    where: {
      userId: query.userId,
      type: query.type,
    },
    select: {
      id: true,
      name: true,
      type: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return { files };
}

async function getFilesBySharedUserId(query: {
  userId: string;
  type?: string;
}) {
  const files = await prisma.file.findMany({
    where: {
      sharedToUsers: {
        some: {
          id: query.userId,
        },
      },
      type: query.type,
    },
    select: {
      id: true,
      name: true,
      type: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return { files };
}

async function updateFileById(
  query: { id: string; type?: string },
  payload: Prisma.FileUpdateInput,
) {
  const file = await prisma.file.update({
    where: {
      id: query.id,
      type: query.type,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      type: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return { file };
}

async function deleteFileById(query: {
  id: string;
  userId: string;
  type?: string;
}) {
  const file = await prisma.file.delete({
    where: {
      id: query.id,
      type: query.type,
      userId: query.userId,
    },
  });

  return { file };
}

export {
  createFile,
  createFiles,
  getFileById,
  getFilesByUserId,
  getFilesBySharedUserId,
  updateFileById,
  deleteFileById,
};
