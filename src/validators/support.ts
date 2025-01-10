import * as zod from "zod";

const sendSupportEmailBodySchema = zod.object({
  subject: zod.string({
    message: "Subject is required",
  }),
  message: zod.string({
    message: "Message is required",
  }),
});

export { sendSupportEmailBodySchema };
