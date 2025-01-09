import type { NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import morgan from "morgan";

import { verifyRequest } from "./middlewares/auth";
import { expandResponse } from "./middlewares/response";
import { authRouter } from "./routers/auth";
import { fileRouter } from "./routers/file";
import { profileRouter } from "./routers/profile";
import { rewardRouter } from "./routers/reward";
import { subscriptionRouter } from "./routers/subscription";
import { supportRouter } from "./routers/support";
import { userRouter } from "./routers/user";

const app = express();

app.use("/subscriptions/webhook", express.raw({ type: "application/json" }));

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expandResponse);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/profiles", profileRouter);
app.use("/files", fileRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/rewards", rewardRouter);
app.use("/support", supportRouter);

app.get("/test", verifyRequest({ isVerified: true }), (_request, response) => {
  response.success({}, { message: "Test route!" });
});

app.all("*", (_request, response) => {
  response.notFound({}, { message: "Not Found!" });
});

app.use(
  (
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    console.error(error);

    response.internalServerError({}, { message: "Internal Server Error!" });
  },
);

export { app };
