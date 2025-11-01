import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.get("/witnesses", async (_req, reply) => {
    const all = await prisma.witness.findMany({ orderBy: { id: "asc" } });
    reply.send(all);
  });

  fastify.post("/witnesses", async (req, reply) => {
    const body = req.body as any;
    const created = await prisma.witness.create({
      data: {
        witness_id: body.witness_id,
        name: body.name,
        contact: body.contact ?? null,
        qualifications: body.qualifications ?? [],
        consent_tier: body.consent_tier ?? "flexible"
      }
    });
    reply.code(201).send(created);
  });
}
