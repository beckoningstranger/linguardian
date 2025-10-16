import { createServer } from "http";

import { mongoConnect } from "@/lib/mongo";
import app from "@/app";

const PORT = process.env.PORT || 8000;
const server = createServer(app);

async function startServer() {
  await mongoConnect();
  server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
}

startServer();
