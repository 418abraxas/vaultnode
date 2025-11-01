import { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export default function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const status = error.statusCode || 500;
  reply.status(status).send({
    code: error.code || "INTERNAL",
    message: error.message,
    details: (error as any).details || null
  });
}
