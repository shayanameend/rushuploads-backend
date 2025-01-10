import { Role } from "@prisma/client";
import { Router } from "express";

import { sendSupportEmail } from "../controllers/support";
import { verifyRequest } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const supportRouter = Router();

supportRouter.post("/", upload, sendSupportEmail);

export { supportRouter };
