import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.get("/bridges", async (req, reply) => {
    const { node_id, limit = 50, offset = 0 } = req.query as any;
    const where = node_id ? { OR: [{ node_id }, { target_node: node_id }] } : {};
    const [total, items] = await Promise.all([
      prisma.bridgeMap.count({ where }),
      prisma.bridgeMap.findMany({ where, take: Number(limit), skip: Number(offset), orderBy: { created_at: "desc" } })
    ]);
    reply.send({ total, items });
  });

  fastify.post("/bridges", async (req, reply) => {
    const body = req.body as any;
    const created = await prisma.bridgeMap.create({
      data: {
        node_id: body.node_id,
        target_node: body.target_node,
        relationship_type: body.relationship_type,
        interlink_key: body.interlink_key ?? null,
        sigma: body.metrics?.sigma ?? null,
        eta: body.metrics?.eta ?? null,
        phi: body.metrics?.phi ?? null,
        delta_hv_pred: body.metrics?.delta_hv_pred ?? null,
        e_deg_risk: body.metrics?.e_deg_risk ?? null,
        gate_sequence: body.gate_sequence ?? [],
        status: body.status ?? "pending",
        decision: body.decision ?? null
      }
    });
    reply.code(201).send(created);
  });

  fastify.get("/bridges/:bridge_id", async (req, reply) => {
    const { bridge_id } = req.params as any;
    const id = Number(bridge_id);
    const found = await prisma.bridgeMap.findUnique({ where: { id } });
    if (!found) return reply.code(404).send({ code: "NOT_FOUND", message: "Bridge not found" });
    reply.send(found);
  });

  fastify.delete("/bridges/:bridge_id", async (req, reply) => {
    const { bridge_id } = req.params as any;
    await prisma.bridgeMap.delete({ where: { id: Number(bridge_id) } });
    reply.code(204).send();
  });
}
