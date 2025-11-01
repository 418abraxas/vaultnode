import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.get("/logs", async (req, reply) => {
    const { node_id, log_type, limit = 50, offset = 0 } = req.query as any;
    const where: any = {};
    if (node_id) where.node_id = node_id;
    if (log_type) where.log_type = log_type;

    const [total, items] = await Promise.all([
      prisma.log.count({ where }),
      prisma.log.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { created_at: "desc" }
      })
    ]);
    reply.send({ total, items });
  });
}
