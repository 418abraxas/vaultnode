import { z } from "zod";

export const createVaultNodeSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  contact: z.string().optional(),
  type: z.enum(["framework","tool","theory","artifact"]).default("framework"),
  tags: z.array(z.string()).default([]),
  consent_tier: z.enum(["strict","flexible","open"]),
  description: z.string().optional(),
  provenance: z.string().optional(),
  phase: z.enum(["draft","review","sealed"]).default("draft"),
  metadata: z.record(z.any()).optional(),
  resonance_vector: z.array(z.number()).length(3).optional(),
  content: z.string().min(1)
});

export const updateVaultNodeSchema = createVaultNodeSchema.partial();
