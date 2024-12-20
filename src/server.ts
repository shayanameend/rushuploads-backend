import type { Server } from "node:http";

import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";

import cron from "node-cron";

import { app } from "./app";
import { cleanupFiles, markExpiredFiles } from "./jobs/file";
import {
  deleteFilesOfNonActiveSubscriptions,
  downgradeNonActiveSubscriptions,
} from "./jobs/subscriptions";
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
  console.log("Running cron job to mark expired files...");
  await markExpiredFiles();
  console.log("Cron job to cleanup files completed!");

  console.log("Running cron job to cleanup files...");
  await cleanupFiles();
  console.log("Cron job to cleanup files completed!");
});

cron.schedule("0 0 * * *", async () => {
  console.log("Running cron job to downgrade non active subscriptions...");
  await downgradeNonActiveSubscriptions();
  console.log("Cron job to downgrade non active subscriptions completed!");
});

cron.schedule("0 0 * * *", async () => {
  console.log(
    "Running cron job to delete files of non active subscriptions...",
  );
  await deleteFilesOfNonActiveSubscriptions();
  console.log(
    "Cron job to delete files of non active subscriptions completed!",
  );
});

export { server };
