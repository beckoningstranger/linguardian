import { MongooseError } from "mongoose";

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const MONGO_URL = process.env.MONGO_URL;

async function mongoConnect() {
  mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready!");
  });
  mongoose.connection.on("error", (err: MongooseError) => {
    console.error(err);
  });

  MONGO_URL
    ? await mongoose.connect(MONGO_URL)
    : console.error("No MONGO_URL set!");
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };
