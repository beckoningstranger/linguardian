import "@/lib/env"; // Load and validate environment variables first
import { createServer } from "http";

import { mongoConnect } from "@/lib/mongo";
import logger from "@/lib/logger";
import { env } from "@/lib/env";
import app from "@/app";

const server = createServer(app);

async function startServer() {
  try {
    await mongoConnect();
    server.listen(env.PORT, () => {
      logger.info(`Server started successfully`, { port: env.PORT });
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

startServer();
