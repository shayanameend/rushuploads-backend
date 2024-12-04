import type { Server } from "node:http";

import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";

import { app } from "./app";
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

export { server };
