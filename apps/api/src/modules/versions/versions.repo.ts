import { prisma } from "../../db/client";

export const repo = {
  list(node_id: string) {
    return prisma.vaultNodeVersion.findMany({
      where: { node_id },
      orderBy: { created_at: "desc" }
    });
  },
  get(node_id: string, version_label: string) {
    return prisma.vaultNodeVersion.findUnique({
      where: { node_id_version_label: { node_id, version_label } }
    });
  },
  async create(node_id: string, version_label: string, content: string, sealed = false, checksum?: string) {
    return prisma.vaultNodeVersion.create({
      data: { node_id, version_label, content, sealed, checksum }
    });
  }
};
