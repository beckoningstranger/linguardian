import app from "./app.js";
import http from "http";
import dotenv from "dotenv";

import { mongoConnect } from "./services/mongo.js";
import { parseCSV } from "./models/item.model.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

app.get("/api/home", (req, res) => {
  res.json({ message: "Hey Linguardian!" });
});

async function startServer() {
  await mongoConnect();
  await parseCSV();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
