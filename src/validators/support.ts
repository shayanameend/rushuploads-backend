import * as zod from "zod";

const sendSupportEmailBodySchema = zod.object({
  subject: zod.string(),
  message: zod.string(),
});

export { sendSupportEmailBodySchema };
