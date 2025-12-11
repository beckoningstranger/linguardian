import { MongooseError } from "mongoose";
import mongoose from "mongoose";

import { env } from "@/lib/env";
import logger from "@/lib/logger";

async function mongoConnect() {
  mongoose.connection.once("open", () =>
    logger.info("MongoDB connection ready")
  );
  mongoose.connection.on("error", (err: MongooseError) => {
    logger.error("MongoDB connection error", { error: err.message, stack: err.stack });
  });

  await mongoose.connect(env.MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };
