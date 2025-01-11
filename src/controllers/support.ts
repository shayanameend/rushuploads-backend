import type { Request, Response } from "express";

import { SendEmailCommand } from "@aws-sdk/client-ses";

import { env } from "../lib/env";
import { handleErrors } from "../lib/error";
import { sendSupportEmailBodySchema } from "../validators/support";
import { sesClient } from "../lib/ses";

export async function sendSupportEmail(request: Request, response: Response) {
  try {
    const { email, subject, message } = sendSupportEmailBodySchema.parse(
      request.body,
    );

    const command = new SendEmailCommand({
      Source: env.APP_SUPPORT_EMAIL,
      Destination: {
        ToAddresses: [env.APP_ADMIN_EMAIL],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: `${message} by ${email}`,
          },
        },
      },
    });

    sesClient.send(command);

    return response.success({}, { message: "Email Sent Successfully!" });
  } catch (error) {
    return handleErrors({ response, error });
  }
}
