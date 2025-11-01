import fp from "fastify-plugin";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

export default fp(async (fastify) => {
  fastify.decorate("verifyApiKey", async (request: any, reply: any) => {
    const apiKey = request.headers["x-api-key"];
    if (apiKey && apiKey === env.API_KEY) return;
    // fallback to bearer
    const auth = request.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      const token = auth.slice(7);
      try {
        jwt.verify(token, env.JWT_SECRET);
        return;
      } catch {
        // fallthrough
      }
    }
    reply.code(401).send({ code: "UNAUTHORIZED", message: "Invalid credentials" });
  });
});
