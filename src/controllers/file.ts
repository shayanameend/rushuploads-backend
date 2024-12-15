import type { Request, Response } from "express";

import { BadResponse, handleErrors } from "../lib/error";
import { createFiles, uploadFiles } from "../services/file";
import { createLink } from "../services/link";
import { createMail, sendFiles } from "../services/mail";
import {
  generateFileLinkBodySchema,
  sendFileMailBodySchema,
} from "../validators/file";

async function generateFileLink(request: Request, response: Response) {
  try {
    const { title, message } = generateFileLinkBodySchema.parse(request.body);

    const rawFiles = (request.files as Express.Multer.File[]) ?? [];

    if (rawFiles.length < 1) {
      throw new BadResponse("No Files Uploaded!");
    }

    await uploadFiles({ rawFiles });

    const { files } = await createFiles({
      userId: request.user.id,
      rawFiles: rawFiles,
    });

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
    const { to, title, message } = sendFileMailBodySchema.parse(request.body);

    const rawFiles = (request.files as Express.Multer.File[]) ?? [];

    if (rawFiles.length < 1) {
      throw new BadResponse("No Files Uploaded!");
    }

    const { files } = await createFiles({
      userId: request.user.id,
      rawFiles: rawFiles,
    });

    const { mail } = await createMail({
      to,
      title,
      message,
      fileIds: files.map((file) => file.id),
      userId: request.user.id,
    });

    sendFiles({
      to: mail.to.join(", "),
      title,
      message,
      files: mail.files,
    });

    response.created(
      {
        data: { mail },
      },
      { message: "Mail Send Successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { generateFileLink, sendFileMail };
