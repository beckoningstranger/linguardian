"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_js_1 = require("./services/mongo.js");
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const server = http_1.default.createServer(app_js_1.default);
app_js_1.default.get("/api/home", (req, res) => {
    res.json({ message: "Hey Linguardian!" });
});
async function startServer() {
    await (0, mongo_js_1.mongoConnect)();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}
startServer();
