import { prisma } from "../../db/client";

export const repo = {
  async create(data: any) {
    const nodeId = `vn-${data.title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}-${Date.now()}`;
    return prisma.vaultNode.create({
      data: {
        node_id: nodeId,
        title: data.title,
        author: data.author,
        contact: data.contact,
        phase: data.phase ?? "draft",
        type: data.type ?? "framework",
        tags: data.tags ?? [],
        consent_tier: data.consent_tier,
        provenance: data.provenance,
        description: data.description,
        version: "1.0.0",
        status: "active",
        content: data.content,
        seal_hash: null,
        witnesses: [],
        resonance_vector: data.resonance_vector ?? [0,0,0],
        metadata: data.metadata ?? {}
      }
    });
  },

  async list(limit: number, offset: number, tag?: string) {
    const where = tag ? { tags: { has: tag } } : {};
    const [total, items] = await Promise.all([
      prisma.vaultNode.count({ where }),
      prisma.vaultNode.findMany({
        where,
        orderBy: { date_created: "desc" },
        take: limit,
        skip: offset
      })
    ]);
    return { total, items };
  },

  get(node_id: string) {
    return prisma.vaultNode.findUnique({ where: { node_id } });
  },

  update(node_id: string, data: any) {
    return prisma.vaultNode.update({
      where: { node_id },
      data
    });
  },

  delete(node_id: string) {
    return prisma.vaultNode.delete({ where: { node_id } });
  }
};
