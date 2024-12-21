import type { Tier } from "@prisma/client";
import type { Request, Response } from "express";

import { TierConstraints } from "../constants/tiers";
import { env } from "../lib/env";
import { BadResponse, handleErrors } from "../lib/error";
import {
  createFiles,
  getFilesBySharedToUserId,
  getFilesByUserId,
  updateFileById,
  uploadFiles,
} from "../services/file";
import { createLink, getLinkById } from "../services/link";
import { createMail, sendFiles } from "../services/mail";
import { updateUserById, upsertUserByEmail } from "../services/user";
import {
  deleteFileParamsSchema,
  generateFileLinkBodySchema,
  getLinkParamsSchema,
  sendFileMailBodySchema,
} from "../validators/file";

async function getUserSharedFiles(request: Request, response: Response) {
  try {
    const { files } = await getFilesByUserId({ userId: request.user?.id });

    const augmentedFiles = files.map((file) => ({
      ...file,
      url: `https://${env.AWS_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${file.name}`,
    }));

    response.success(
      {
        data: { files: augmentedFiles },
      },
      { message: "Files Fetched Successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function getUserReceivedFiles(request: Request, response: Response) {
  try {
    const { files } = await getFilesBySharedToUserId({
      userId: request.user?.id,
    });

    const augmentedFiles = files.map((file) => ({
      ...file,
      url: `https://${env.AWS_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${file.name}`,
    }));

    response.success(
      {
        data: { files: augmentedFiles },
      },
      { message: "Files Fetched Successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function getLink(request: Request, response: Response) {
  try {
    const { linkId } = getLinkParamsSchema.parse(request.params);

    const { link } = await getLinkById({ id: linkId });

    if (!link) {
      throw new BadResponse("Link Not Found!");
    }

    const augmentedFiles = link.files.map((file) => ({
      ...file,
      url: `https://${env.AWS_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${file.name}`,
    }));

    link.files = augmentedFiles;

    response.success(
      {
        data: { link },
      },
      { message: "Link Fetched Successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function generateFileLink(request: Request, response: Response) {
  try {
    const { title, message, expiresInDays } = generateFileLinkBodySchema.parse(
      request.body,
    );

    const rawFiles = (request.files as Express.Multer.File[]) ?? [];

    if (rawFiles.length < 1) {
      throw new BadResponse("No Files Uploaded!");
    }

    const totalFileSize = rawFiles.reduce((acc, file) => acc + file.size, 0);

    const userTier = request.user.tier;
    const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000;

    validateFileConstraints({
      userTier,
      totalFileSize,
      expiresInMs,
      remainingStorage: request.user.totalStorage - request.user.usedStorage,
    });

    const expiresAt = new Date(Date.now() + expiresInMs);

    const [_p1, p2, _p3] = await Promise.all([
      uploadFiles({ rawFiles }),

      createFiles({
        userId: request.user.id,
        expiresAt,
        rawFiles,
        sharedToUserIds: [],
      }),

      updateUserById(
        { id: request.user.id },
        {
          usedStorage: request.user.usedStorage + totalFileSize,
        },
      ),
    ]);

    const { link } = await createLink({
      title,
      message,
      fileIds: p2.files.map((file) => file.id),
      userId: request.user.id,
    });

    const augmentedFiles = link.files.map((file) => ({
      ...file,
      url: `https://${env.AWS_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${file.name}`,
    }));

    link.files = augmentedFiles;

    response.created(
      {
        data: { link },
      },
      { message: "Link Created Successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function sendFileMail(request: Request, response: Response) {
  try {
    request.body.to = request.body.to
      .split(",")
      .map((email: string) => email.trim());

    const { to, title, message, expiresInDays } = sendFileMailBodySchema.parse(
      request.body,
    );

    const rawFiles = (request.files as Express.Multer.File[]) ?? [];

    if (rawFiles.length < 1) {
      throw new BadResponse("No Files Uploaded!");
    }

    const totalFileSize = rawFiles.reduce((acc, file) => acc + file.size, 0);

    const userTier = request.user.tier;
    const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000;

    validateFileConstraints({
      userTier,
      totalFileSize,
      expiresInMs,
      remainingStorage: request.user.totalStorage - request.user.usedStorage,
    });

    const expiresAt = new Date(Date.now() + expiresInMs);

    const users = await Promise.all(
      to.map((email) => upsertUserByEmail({ email }, {})),
    );

    const [_p1, p2, _p3] = await Promise.all([
      uploadFiles({ rawFiles }),

      createFiles({
        userId: request.user.id,
        expiresAt,
        rawFiles,
        sharedToUserIds: users.map(({ user }) => user.id),
      }),

      updateUserById(
        { id: request.user.id },
        {
          usedStorage: request.user.usedStorage + totalFileSize,
        },
      ),
    ]);

    const { mail } = await createMail({
      to,
      title,
      message,
      fileIds: p2.files.map((file) => file.id),
      userId: request.user.id,
    });

    const augmentedFiles = mail.files.map((file) => ({
      ...file,
      url: `https://${env.AWS_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${file.name}`,
    }));

    sendFiles({
      to: mail.to.join(", "),
      title: mail.title,
      message: mail.message,
      files: augmentedFiles,
    });

    mail.files = augmentedFiles;

    response.created(
      {
        data: { mail },
      },
      { message: "Mail Sent Successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function deleteFile(request: Request, response: Response) {
  try {
    const { fileId } = deleteFileParamsSchema.parse(request.params);

    const { file } = await updateFileById(
      { fileId, userId: request.user.id },
      { isDeleted: true },
    );

    if (!file) {
      throw new BadResponse("File Not Found!");
    }

    response.success({ file }, { message: "File Deleted Successfully!" });
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export {
  generateFileLink,
  sendFileMail,
  getUserSharedFiles,
  getUserReceivedFiles,
  getLink,
  deleteFile,
};

function validateFileConstraints({
  userTier,
  totalFileSize,
  expiresInMs,
  remainingStorage,
}: {
  userTier: Tier;
  totalFileSize: number;
  expiresInMs: number;
  remainingStorage: number;
}) {
  const tierConstraints = TierConstraints[userTier];

  if (totalFileSize > tierConstraints.maxSendSize) {
    throw new BadResponse(
      `File size limit exceeded! Max allowed is ${
        tierConstraints.maxSendSize / (1024 * 1024 * 1024)
      } GB for your tier.`,
    );
  }

  if (remainingStorage < totalFileSize) {
    throw new BadResponse(
      `Not enough storage! You have ${
        remainingStorage / (1024 * 1024 * 1024)
      } GB remaining.`,
    );
  }

  if (
    expiresInMs < tierConstraints.minExpiry ||
    expiresInMs > tierConstraints.maxExpiry
  ) {
    throw new BadResponse(
      `Expiry must be between ${
        tierConstraints.minExpiry / (24 * 60 * 60 * 1000)
      } and ${
        tierConstraints.maxExpiry / (24 * 60 * 60 * 1000)
      } days for your tier.`,
    );
  }
}
