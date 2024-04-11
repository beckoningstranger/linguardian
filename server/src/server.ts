import fs from "fs";
import app from "./app.js";
import https from "https";

import { siteSettings } from "./services/siteSettings.js";
import { updateSiteSettings } from "./models/settings.model.js";

import { mongoConnect } from "./services/mongo.js";
import { dirname, join } from "path";
import { env } from "./services/getEnv.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = env.PORT || 8000;
const server = https.createServer(
  {
    key: fs.readFileSync(join(__dirname + "../../../key.pem")),
    cert: fs.readFileSync(join(__dirname + "../../../cert.pem")),
  },
  app
);

async function startServer() {
  await mongoConnect();
  await updateSiteSettings(siteSettings);

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
