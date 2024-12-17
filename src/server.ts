import type { Server } from "node:http";

import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";

import cron from "node-cron";

import { app } from "./app";
import { cleanupExpiredFiles } from "./jobs/file";
import { env } from "./lib/env";

let server: Server;

switch (env.NODE_ENV) {
  case "production":
    server = createHttpsServer(app);
    break;
  case "development":
    server = createHttpServer(app);
    break;
}

server.listen({ port: env.PORT }, () => {
  console.log(
    `Server is live on ${env.NODE_ENV === "production" ? "https" : "http"}://localhost:${env.PORT}`,
  );
});

cron.schedule("0 0 * * *", async () => {
  console.log("Running expired files cleanup task...");
  await cleanupExpiredFiles();
});

export { server };
