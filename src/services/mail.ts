import { prisma } from "../lib/prisma";

async function createMail(payload: {
  to: string[];
  title?: string;
  message?: string;
  fileIds: string[];
  userId: string;
}) {
  const mail = await prisma.mail.create({
    data: {
      to: payload.to,
      title: payload.title,
      message: payload.message,
      files: {
        connect: payload.fileIds.map((id) => ({ id })),
      },
      user: {
        connect: {
          id: payload.userId,
        },
      },
    },
    select: {
      id: true,
      to: true,
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

  return { mail };
}

export { createMail };
