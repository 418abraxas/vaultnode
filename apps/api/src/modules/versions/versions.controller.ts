import { FastifyReply, FastifyRequest } from "fastify";
import { repo } from "./versions.repo";

export async function listVersions(req: FastifyRequest, reply: FastifyReply) {
  const { node_id } = req.params as any;
  const data = await repo.list(node_id);
  reply.send(data);
}

export async function createVersion(req: FastifyRequest, reply: FastifyReply) {
  const { node_id } = req.params as any;
  const { version_label, content, sealed = false } = req.body as any;
  if (!version_label || !content) {
    return reply.code(400).send({ code: "BAD_REQUEST", message: "version_label and content required" });
  }
  const created = await repo.create(node_id, version_label, content, sealed);
  reply.code(201).send(created);
}

export async function getVersion(req: FastifyRequest, reply: FastifyReply) {
  const { node_id, version_label } = req.params as any;
  const v = await repo.get(node_id, version_label);
  if (!v) return reply.code(404).send({ code: "NOT_FOUND", message: "Version not found" });
  reply.send(v);
}
