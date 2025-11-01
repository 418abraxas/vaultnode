import { FastifyInstance } from "fastify";
import { createNode, listNodes, getNode, updateNode, deleteNode } from "./vaultnodes.controller";

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.get("/vaultnodes", listNodes);
  fastify.post("/vaultnodes", createNode);
  fastify.get("/vaultnodes/:node_id", getNode);
  fastify.patch("/vaultnodes/:node_id", updateNode);
  fastify.delete("/vaultnodes/:node_id", deleteNode);
}
