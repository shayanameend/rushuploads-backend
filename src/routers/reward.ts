import { Role } from "@prisma/client";
import { Router } from "express";

import { createOnboard, getRewards, redeemReward } from "../controllers/reward";
import { verifyRequest } from "../middlewares/auth";

const rewardRouter = Router();

rewardRouter.get(
  "/",
  verifyRequest({
    isVerified: true,
    role: Role.USER,
  }),
  getRewards,
);

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
