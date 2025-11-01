import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import * as fs from "fs";
import * as path from "path";

export default fp(async (fastify) => {
  const specPath = path.join(__dirname, "../../../..", "openapi", "vaultnode.yaml");
  const openapi = fs.readFileSync(specPath, "utf8");

  await fastify.register(swagger, {
    mode: "yaml",
    yaml: openapi
  });
  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: true }
  });
});
