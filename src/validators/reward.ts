import * as zod from "zod";

const redeemRewardParamsSchema = zod.object({
  linkId: zod.string({
    message: "LinkId must be a string",
  }),
});

const redeemRewardBodySchema = zod.object({
  amountInCents: zod
    .number({
      message: "Amount must be a number",
    })
    .int({
      message: "Amount must be an integer",
    })
    .positive({
      message: "Amount must be positive",
    }),
});

export { redeemRewardParamsSchema, redeemRewardBodySchema };
