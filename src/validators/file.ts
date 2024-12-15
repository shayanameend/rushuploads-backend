import * as zod from "zod";

const generateFileLinkBodySchema = zod.object({
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
});

const sendFileMailBodySchema = zod.object({
  to: zod
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
});

export { generateFileLinkBodySchema, sendFileMailBodySchema };
