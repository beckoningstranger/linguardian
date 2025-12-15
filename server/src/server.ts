import "@/config/env"; // Load and validate environment variables first
import { createServer } from "http";

import { mongoConnect } from "@/config/mongo";
import logger from "@/utils/logger";
import { env } from "@/config/env";
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
