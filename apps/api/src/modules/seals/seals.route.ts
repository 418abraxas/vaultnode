import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";
import { sha256 } from "../../utils/hashing";

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.post("/seal", async (req, reply) => {
    const { node_id, mode, witness_id } = req.body as any;
    const node = await prisma.vaultNode.findUnique({ where: { node_id } });
    if (!node) return reply.code(404).send({ code: "NOT_FOUND", message: "Node not found" });

    const payload = {
      node_id,
      mode,
      witness_id,
      timestamp: new Date().toISOString()
    };
    const seal_hash = sha256(payload);

    const sealed = await prisma.vaultNode.update({
      where: { node_id },
      data: { seal_hash, date_sealed: new Date(), phase: "sealed" }
    });

    await prisma.log.create({
      data: { node_id, log_type: "seal", payload: { mode, witness_id, seal_hash } }
    });

    reply.send({ node_id, mode, seal_hash, date_sealed: sealed.date_sealed });
  });

  fastify.post("/reopen", async (req, reply) => {
    const { node_id, reason, witness_id } = req.body as any;
    const node = await prisma.vaultNode.findUnique({ where: { node_id } });
    if (!node) return reply.code(404).send({ code: "NOT_FOUND", message: "Node not found" });

    // Soft policy assumed
    const reopened = await prisma.vaultNode.update({
      where: { node_id },
      data: { phase: "review" }
    });

    await prisma.log.create({
      data: { node_id, log_type: "seal", payload: { action: "reopen", reason, witness_id } }
    });

    reply.send(reopened);
  });
}
