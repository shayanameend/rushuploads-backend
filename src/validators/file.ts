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
  expiresInDays: zod.coerce.number({
    message: "Expires In Days must be a number!",
  }),
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
  expiresInDays: zod.coerce.number({
    message: "Expires In Days must be a number!",
  }),
});

const getLinkParamsSchema = zod.object({
  linkId: zod.string({
    message: "Link ID must be a string!",
  }),
});

const deleteFileParamsSchema = zod.object({
  fileId: zod.string({
    message: "File ID must be a string!",
  }),
});

export {
  generateFileLinkBodySchema,
  sendFileMailBodySchema,
  getLinkParamsSchema,
  deleteFileParamsSchema,
};
