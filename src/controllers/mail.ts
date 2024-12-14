import type { Request, Response } from "express";

import { handleErrors } from "../lib/error";
import { createMail } from "../services/mail";
import { sendMailBodySchema } from "../validators/mail";

async function sendMail(request: Request, response: Response) {
  try {
    const { receiverEmails, title, message, fileIds } =
      sendMailBodySchema.parse(request.body);

    const { mail } = await createMail({
      receiverEmails,
      title,
      message,
      fileIds,
      userId: request.user.id,
    });

    response.created(
      {
        data: { mail },
      },
      { message: "Mail send successfully!" },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { sendMail };
