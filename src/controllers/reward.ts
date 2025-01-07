import type { Request, Response } from "express";

import { env } from "../lib/env";
import { handleErrors } from "../lib/error";
import { stripe } from "../lib/stripe";

export async function createOnboard(request: Request, response: Response) {
  try {
    const { id } = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: request.user.email,
    });

    const accountLink = await stripe.accountLinks.create({
      account: id,
      refresh_url: `${env.CLIENT_BASE_URL}${env.STRIPE_RETURN_ENDPOINT}`,
      return_url: `${env.CLIENT_BASE_URL}${env.STRIPE_RETURN_ENDPOINT}`,
      type: "account_onboarding",
    });

    return response.created(
      {
        data: {
          url: accountLink.url,
        },
      },
      {
        message: "Onboard Session Created!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}
