import Fastify from "fastify";
// import corsPlugin from "./plugins/cors";
import swaggerPlugin from "./plugins/swagger";
import authPlugin from "./plugins/auth";
import rateLimitPlugin from "./plugins/rate-limit";
import errorMiddleware from "./middleware/error";

import vaultnodesRoutes from "./modules/vaultnodes/vaultnodes.route";
// import versionsRoutes from "./modules/versions/versions.route";
import bridgesRoutes from "./modules/bridges/bridges.route";
import mirrorsRoutes from "./modules/mirrors/mirrors.route";
import sealsRoutes from "./modules/seals/seals.route";
import witnessesRoutes from "./modules/witnesses/witnesses.route";
import logsRoutes from "./modules/logs/logs.route";
import auditsRoutes from "./modules/audits/audits.route";
import searchRoutes from "./modules/search/search.route";

export async function buildServer() {
  const server = Fastify({
    logger: {
      level: "info",
      transport: process.env.NODE_ENV !== "production" ? { target: "pino-pretty" } : undefined
    }
  });

  server.get("/healthz", async () => ({ ok: true }));

  await server.register(corsPlugin);
  await server.register(rateLimitPlugin);
  await server.register(swaggerPlugin);
  await server.register(authPlugin);

  // Routes
  await server.register(vaultnodesRoutes, { prefix: "/v1" });
  await server.register(versionsRoutes, { prefix: "/v1" });
  await server.register(bridgesRoutes, { prefix: "/v1" });
  await server.register(mirrorsRoutes, { prefix: "/v1" });
  await server.register(sealsRoutes, { prefix: "/v1" });
  await server.register(witnessesRoutes, { prefix: "/v1" });
  await server.register(logsRoutes, { prefix: "/v1" });
  await server.register(auditsRoutes, { prefix: "/v1" });
  await server.register(searchRoutes, { prefix: "/v1" });

  server.setErrorHandler(errorMiddleware);

  return server;
}

