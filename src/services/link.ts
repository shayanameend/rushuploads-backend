import { prisma } from "../lib/prisma";

async function createLink(payload: {
  title?: string;
  message?: string;
  fileIds: string[];
  userId: string;
}) {
  const link = await prisma.link.create({
    data: {
      title: payload.title,
      message: payload.message,
      fileIds: payload.fileIds,
      userId: payload.userId,
    },
    select: {
      id: true,
      title: true,
      message: true,
      updatedAt: true,
      files: {
        select: {
          id: true,
          originalName: true,
          name: true,
          type: true,
          updatedAt: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  return { link };
}

export { createLink };
