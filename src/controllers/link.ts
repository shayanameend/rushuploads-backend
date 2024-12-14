import type { Request, Response } from "express";

import { handleErrors } from "../lib/error";
import { createLink } from "../services/link";
import { generateLinkBodySchema } from "../validators/link";

async function generateLink(request: Request, response: Response) {
  try {
    const { title, message, fileIds } = generateLinkBodySchema.parse(
      request.body,
    );

    const { link } = await createLink({
      title,
      message,
      fileIds,
      userId: request.user.id,
    });

    response.created(
      {
        data: { link },
      },
      { message: "Link created successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { generateLink };
