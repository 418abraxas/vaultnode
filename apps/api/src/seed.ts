import { prisma } from "./db/client";

async function main() {
  const witness = await prisma.witness.upsert({
    where: { witness_id: "user-skida" },
    update: {},
    create: { witness_id: "user-skida", name: "Skida", contact: "skida@example.com", qualifications: ["core"], consent_tier: "flexible" }
  });

  const node = await prisma.vaultNode.upsert({
    where: { node_id: "vn-demo-001" },
    update: {},
    create: {
      node_id: "vn-demo-001",
      title: "Demo VaultNode",
      author: "418",
      consent_tier: "flexible",
      tags: ["demo"],
      content: "# Demo\n\nThis is a demo node.",
      resonance_vector: [0.8, 0.7, 0.9],
      metadata: { demo: true }
    }
  });

  console.log({ witness, node });
}

main().finally(() => prisma.$disconnect());
