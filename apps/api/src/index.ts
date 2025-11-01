import { buildServer } from "./server";

const start = async () => {
  const server = await buildServer();
  const port = Number(process.env.PORT || 3000);
  const host = "0.0.0.0";
  try {
    await server.listen({ port, host });
    server.log.info(`VaultNode API listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
