import type { NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import morgan from "morgan";

import { verifyRequest } from "./middlewares/auth";
import { expandResponse } from "./middlewares/response";
import { authRouter } from "./routers/auth";
import { fileRouter } from "./routers/file";
import { linkRouter } from "./routers/link";
import { mailRouter } from "./routers/mail";
import { userRouter } from "./routers/user";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expandResponse);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/files", fileRouter);
app.use("/links", linkRouter);
app.use("/mails", mailRouter);

app.get("/test", verifyRequest({ isVerified: true }), (_request, response) => {
  response.success({}, { message: "Test route!" });
});

app.use("/uploads", express.static("uploads"));

app.all("/uploads/*", (_request, response) => {
  response.notFound({}, { message: "Expired!" });
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
