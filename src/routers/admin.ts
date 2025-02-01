import { Router } from "express";

import {
  deleteFile,
  deleteUser,
  getAllFiles,
  getAllUsers,
  getKPIs,
} from "../controllers/admin";
import { verifyRequest } from "../middlewares/auth";

const adminRouter = Router();

adminRouter.get(
  "/kpis",
  verifyRequest({
    isVerified: true,
    role: "ADMIN",
  }),
  getKPIs,
);

adminRouter.get(
  "/users",
  verifyRequest({
    isVerified: true,
    role: "ADMIN",
  }),
  getAllUsers,
);

adminRouter.get(
  "/files",
  verifyRequest({
    isVerified: true,
    role: "ADMIN",
  }),
  getAllFiles,
);

adminRouter.delete(
  "/users/:id",
  verifyRequest({
    isVerified: true,
    role: "ADMIN",
  }),
  deleteUser,
);

adminRouter.delete(
  "/files/:id",
  verifyRequest({
    isVerified: true,
    role: "ADMIN",
  }),
  deleteFile,
);

export { adminRouter };
