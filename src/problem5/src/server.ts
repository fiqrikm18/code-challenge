import "dotenv/config";

import app from "./app";
import { databaseClient } from "./db/index";

const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await databaseClient.end();

    console.log("Server shutdown complete");

    process.exit(0);
  });
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
