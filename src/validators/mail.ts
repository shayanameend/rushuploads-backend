import * as zod from "zod";

const sendMailBodySchema = zod.object({
  receiverEmails: zod
    .array(
      zod
        .string({
          message: "Receiver Email must be a string!",
        })
        .email({
          message: "Receiver Email must be a valid email!",
        }),
    )
    .min(1, {
      message: "At least 1 Receiver Email is required!",
    }),
  title: zod
    .string({
      message: "Title must be a string!",
    })
    .optional(),
  message: zod
    .string({
      message: "Message must be a string!",
    })
    .optional(),
  fileIds: zod
    .array(
      zod.string({
        message: "File ID must be a string!",
      }),
    )
    .min(1, {
      message: "At least 1 File ID is required!",
    }),
});

export { sendMailBodySchema };
