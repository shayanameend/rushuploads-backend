import * as zod from "zod";

const generateLinkBodySchema = zod.object({
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

export { generateLinkBodySchema };
