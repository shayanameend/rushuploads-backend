import { Router } from "express";

import { getKPIs } from "../controllers/admin";
import { verifyRequest } from "../middlewares/auth";

const adminRouter = Router();

adminRouter.get(
  "/kpis",
  verifyRequest({
    isVerified: true,
    // role: "ADMIN",
  }),
  getKPIs,
);

export { adminRouter };
