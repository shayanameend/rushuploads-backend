import type { Request, Response } from "express";

import { handleErrors } from "../lib/error";
import { nodemailerTransporter } from "../lib/nodemailer";
import { sendSupportEmailBodySchema } from "../validators/support";
import { env } from "../lib/env";

export async function sendSupportEmail(request: Request, response: Response) {
  try {
    const { subject, message } = sendSupportEmailBodySchema.parse(request.body);

    nodemailerTransporter.sendMail({
      from: request.user.email,
      to: env.APP_SUPPORT_EMAIL,
      subject,
      text: message,
    });

    return response.success({}, { message: "Email Sent Successfully!" });
  } catch (error) {
    return handleErrors({ response, error });
  }
}
