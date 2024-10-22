import { createServer } from "http";
import app from "./app.js";
import { mongoConnect } from "./lib/mongo.js";
import { siteSettings } from "./lib/siteSettings.js";
import { setSiteSettings } from "./models/settings.model.js";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import https from "https";

// // const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8000;
// const server = https.createServer(
//   {
//     key: fs.readFileSync(join(__dirname + "../../../key.pem")),
//     cert: fs.readFileSync(join(__dirname + "../../../cert.pem")),
//   },
//   app
// );
const server = createServer(app);

async function startServer() {
  await mongoConnect();
  await setSiteSettings(siteSettings);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
