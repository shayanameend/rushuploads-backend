import type { Request, Response } from "express";

import type { Tier } from "@prisma/client";

import { TierConstraints } from "../constants/tiers";
import { BadResponse, handleErrors } from "../lib/error";
import { createFiles, uploadFiles } from "../services/file";
import { createLink } from "../services/link";
import { createMail, sendFiles } from "../services/mail";
import { updateUserById } from "../services/user";
import {
  generateFileLinkBodySchema,
  sendFileMailBodySchema,
} from "../validators/file";

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

    validateFileConstraints(
      userTier,
      totalFileSize,
      expiresInMs,
      request.user.remainingStorage,
    );

    const expiresAt = new Date(Date.now() + expiresInMs);

    await uploadFiles({ rawFiles });

    const { files } = await createFiles({
      userId: request.user.id,
      expiresAt,
      rawFiles,
    });

    await updateUserById(
      { id: request.user.id },
      {
        remainingStorage: request.user.remainingStorage - totalFileSize,
      },
    );

    const { link } = await createLink({
      title,
      message,
      fileIds: files.map((file) => file.id),
      userId: request.user.id,
    });

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

    validateFileConstraints(
      userTier,
      totalFileSize,
      expiresInMs,
      request.user.remainingStorage,
    );

    const expiresAt = new Date(Date.now() + expiresInMs);

    await uploadFiles({ rawFiles });

    const { files } = await createFiles({
      userId: request.user.id,
      expiresAt,
      rawFiles,
    });

    await updateUserById(
      { id: request.user.id },
      {
        remainingStorage: request.user.remainingStorage - totalFileSize,
      },
    );

    const { mail } = await createMail({
      to,
      title,
      message,
      fileIds: files.map((file) => file.id),
      userId: request.user.id,
    });

    sendFiles({
      to: mail.to.join(", "),
      title: mail.title,
      message: mail.message,
      files: mail.files.map((file, index) => ({
        ...file,
        buffer: rawFiles[index].buffer,
      })),
    });

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

export { generateFileLink, sendFileMail };

function validateFileConstraints(
  userTier: Tier,
  totalFileSize: number,
  expiresInMs: number,
  remainingStorage: number,
) {
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
