import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { corsOrigins } from "../config/env";

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (corsOrigins.includes("*") || corsOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS not allowed"), false);
    },
    credentials: true
  });
});
