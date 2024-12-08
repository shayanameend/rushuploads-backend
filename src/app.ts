import type { NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import morgan from "morgan";

import { verifyRequest } from "./middlewares/auth";
import { expandResponse } from "./middlewares/response";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expandResponse);

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.get("/test", verifyRequest({ isVerified: true }), (_request, response) => {
  response.success({}, { message: "Test route!" });

  return;
});

app.get("*", (_request, response) => {
  response.notFound({}, { message: "Route not found!" });

  return;
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

    return;
  },
);

export { app };
