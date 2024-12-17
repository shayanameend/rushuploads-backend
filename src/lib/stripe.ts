import { Stripe } from "stripe";

import { env } from "../lib/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export { stripe };
