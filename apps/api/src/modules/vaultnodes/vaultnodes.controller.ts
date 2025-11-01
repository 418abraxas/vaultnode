import { FastifyReply, FastifyRequest } from "fastify";
import { createVaultNodeSchema, updateVaultNodeSchema } from "./vaultnodes.schemas";
import { service } from "./vaultnodes.service";

export async function createNode(req: FastifyRequest, reply: FastifyReply) {
  const parsed = createVaultNodeSchema.parse(req.body);
  const node = await service.create(parsed);
  reply.code(201).send(node);
}

export async function listNodes(req: FastifyRequest, reply: FastifyReply) {
  const { limit = 50, offset = 0, tag } = req.query as any;
  const data = await service.list(Number(limit), Number(offset), tag);
  reply.send(data);
}

export async function getNode(req: FastifyRequest, reply: FastifyReply) {
  const { node_id } = req.params as any;
  const node = await service.get(node_id);
  if (!node) return reply.code(404).send({ code: "NOT_FOUND", message: "Node not found" });
  reply.send(node);
}

export async function updateNode(req: FastifyRequest, reply: FastifyReply) {
  const { node_id } = req.params as any;
  const parsed = updateVaultNodeSchema.parse(req.body || {});
  const node = await service.update(node_id, parsed);
  reply.send(node);
}

export async function deleteNode(req: FastifyRequest, reply: FastifyReply) {
  const { node_id } = req.params as any;
  await service.delete(node_id);
  reply.code(204).send();
}
