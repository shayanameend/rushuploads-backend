import cors from "cors";
import express from "express";
import morgan from "morgan";

import { authRouter } from "./routers/auth";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/auth", authRouter);

export { app };
