import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.get("/audit", async (req, reply) => {
    const { scope = "all" } = req.query as any;

    const [vaultnodes, bridges, refusals] = await Promise.all([
      prisma.vaultNode.count(),
      prisma.bridgeMap.count(),
      prisma.refusal.count()
    ]);

    const strainAlerts: string[] = [];
    const driftWarnings: string[] = [];
    const protoBlooms: string[] = [];

    reply.send({
      generated_at: new Date().toISOString(),
      totals: { vaultnodes, bridges, refusals },
      strain_alerts: strainAlerts,
      drift_warnings: driftWarnings,
      proto_blooms: protoBlooms
    });
  });
}
