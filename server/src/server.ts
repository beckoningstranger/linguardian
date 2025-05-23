import { createServer } from "http";
import app from "./app.js";
import { mongoConnect } from "./lib/mongo.js";

const PORT = process.env.PORT || 8000;
const server = createServer(app);

async function startServer() {
  await mongoConnect();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
