import { FastifyInstance } from "fastify";
import { prisma } from "../../db/client";
import { snippet } from "../../utils/text";

export default async function routes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", (fastify as any).verifyApiKey);

  fastify.get("/search", async (req, reply) => {
    const { q = "", limit = 50, offset = 0 } = req.query as any;
    if (!q || String(q).trim().length < 2) return reply.send({ total: 0, items: [] });

    const items = await prisma.vaultNode.findMany({
      where: {
        OR: [
          { title: { contains: q as string, mode: "insensitive" } },
          { description: { contains: q as string, mode: "insensitive" } },
          { content: { contains: q as string, mode: "insensitive" } }
        ]
      },
      take: Number(limit),
      skip: Number(offset)
    });

    const results = items.map((n) => ({
      node_id: n.node_id,
      title: n.title,
      author: n.author,
      score: 1, // placeholder; add ranking later if needed
      snippet: snippet(n.content || "")
    }));

    reply.send({ total: results.length, items: results });
  });
}
