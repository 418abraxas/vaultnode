// src/plugins/swagger.ts
import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import yaml from "yaml";
import * as fs from "fs";
import * as path from "path";

export default fp(async (fastify) => {
  // load and parse your YAML spec
  const specPath = path.join(__dirname, "../../../..", "openapi", "vaultnode.yaml");
  const yamlText = fs.readFileSync(specPath, "utf8");
  const openapi = yaml.parse(yamlText);

  // register swagger using parsed object
  await fastify.register(swagger, {
    mode: "static",
    specification: {
      document: openapi,
      baseDir: path.dirname(specPath)
    }
  });

  // register the Swagger UI
  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: true }
  });
});
