import { nodemailerTransporter } from "../lib/nodemailer";
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

async function sendOTP({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  nodemailerTransporter.sendMail(
    {
      from: {
        name: "Rush Uploads",
        address: "support@rushuploads.com",
      },
      to,
      subject: "Verify Your Email",
      text: `Your OTP Code is: ${code}`,
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
}

async function sendFiles({
  to,
  title,
  message,
  files,
}: {
  to: string;
  title: string;
  message: string;
  files: {
    originalName: string;
    name: string;
    type: string;
  }[];
}) {
  nodemailerTransporter.sendMail(
    {
      from: {
        name: "Rush Uploads",
        address: "support@rushuploads.com",
      },
      to,
      subject: title,
      text: message,
      attachments: files.map((file) => ({
        filename: file.originalName,
        path: `http://localhost:8080/uploads/${file.name}`,
        contentType: file.type,
      })),
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
}

export { createMail, sendOTP, sendFiles };
