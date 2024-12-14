import type { Request, Response } from "express";

import { BadResponse, handleErrors } from "../lib/error";
import { createFiles } from "../services/file";

async function uploadFiles(request: Request, response: Response) {
  try {
    const rawFiles = (request.files as Express.Multer.File[]) ?? [];

    if (rawFiles.length < 1) {
      throw new BadResponse("No Files Uploaded!");
    }

    const { files } = await createFiles({
      userId: request.user.id,
      rawFiles: rawFiles,
    });

    response.created(
      {
        data: { files },
      },
      { message: "Files Uploaded Successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { uploadFiles };
