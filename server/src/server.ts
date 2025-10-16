import app from "@/app";
import { mongoConnect } from "@/lib/mongo";
import { createServer } from "http";
import { getFullyPopulatedListByListNumber } from "./models/lists.model";

const PORT = process.env.PORT || 8000;
const server = createServer(app);

async function startServer() {
  await mongoConnect();
  server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
}

startServer();
const listResponse = await getFullyPopulatedListByListNumber(2);
console.log(listResponse);
