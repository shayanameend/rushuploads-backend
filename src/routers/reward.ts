import { Role } from "@prisma/client";
import { Router } from "express";

import { createOnboard, redeemReward } from "../controllers/reward";
import { verifyRequest } from "../middlewares/auth";

const rewardRouter = Router();

rewardRouter.post(
  "/onboard",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  createOnboard,
);

rewardRouter.post(
  "/redeem/:linkId",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  redeemReward,
);

export { rewardRouter };
