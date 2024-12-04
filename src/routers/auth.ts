import { Router } from "express";

import { signUp } from "../controllers/auth";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

export { authRouter };
