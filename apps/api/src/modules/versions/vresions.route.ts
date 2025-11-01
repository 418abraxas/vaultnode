import { FastifyInstance } from "fastify";
import { listVersions, createVersion, getVersion } from "./versions.controller";

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.get("/vaultnodes/:node_id/versions", listVersions);
  fastify.post("/vaultnodes/:node_id/versions", createVersion);
  fastify.get("/vaultnodes/:node_id/versions/:version_label", getVersion);
}
