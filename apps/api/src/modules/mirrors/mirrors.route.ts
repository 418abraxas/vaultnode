import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";

function simpleSimilarity(a?: string | null, b?: string | null): number {
  if (!a || !b) return 0;
  const A = a.toLowerCase();
  const B = b.toLowerCase();
  if (A === B) return 1;
  const overlap = A.split(/\W+/).filter((w) => B.includes(w)).length;
  const denom = new Set([...A.split(/\W+/), ...B.split(/\W+/)]).size || 1;
  return overlap / denom;
}

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.post("/mirrors", async (req, reply) => {
    const { node_a, node_b, policy = "strict" } = req.body as any;
    const [A, B] = await Promise.all([
      prisma.vaultNode.findUnique({ where: { node_id: node_a } }),
      prisma.vaultNode.findUnique({ where: { node_id: node_b } })
    ]);
    if (!A || !B) return reply.code(404).send({ code: "NOT_FOUND", message: "Node(s) not found" });

    const simTitle = simpleSimilarity(A.title, B.title);
    const simContent = simpleSimilarity(A.content, B.content);
    const alignment_score = Number(((simTitle * 0.3) + (simContent * 0.7)).toFixed(3));
    const sigma = Number((1 - alignment_score).toFixed(3));
    const eta = 0.9; // stub
    const phi = 0.8; // stub

    const created = await prisma.mirrorCheck.create({
      data: {
        node_a, node_b, policy,
        sigma, eta, phi, alignment_score,
        notes: "Auto-generated mirror check",
        report: {}
      }
    });

    reply.send(created);
  });
}
