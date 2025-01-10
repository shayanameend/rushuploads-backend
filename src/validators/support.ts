import * as zod from "zod";

const sendSupportEmailBodySchema = zod.object({
  email: zod.string({
    message: "Email is required",
  }),
  subject: zod.string({
    message: "Subject is required",
  }),
  message: zod.string({
    message: "Message is required",
  }),
});

export { sendSupportEmailBodySchema };
