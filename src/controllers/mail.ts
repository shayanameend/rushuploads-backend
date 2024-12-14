import type { Request, Response } from "express";

import { handleErrors } from "../lib/error";
import { createMail } from "../services/mail";
import { sendFiles } from "../utils/mail";
import { sendMailBodySchema } from "../validators/mail";

async function sendMail(request: Request, response: Response) {
  try {
    const { to, title, message, fileIds } = sendMailBodySchema.parse(
      request.body,
    );

    const { mail } = await createMail({
      to,
      title,
      message,
      fileIds,
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

export { sendMail };
