import { SESClient } from "@aws-sdk/client-ses";

import { env } from "./env";

const sesClient = new SESClient({
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  region: env.AWS_REGION,
});

export { sesClient };
