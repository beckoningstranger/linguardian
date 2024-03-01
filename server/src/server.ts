import app from "./app.js";
import http from "http";
import dotenv from "dotenv";

import { mongoConnect } from "./services/mongo.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
