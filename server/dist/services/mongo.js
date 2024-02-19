"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDisconnect = exports.mongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL;
async function mongoConnect() {
    mongoose_1.default.connection.once("open", () => {
        console.log("MongoDB connection ready!");
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.error(err);
    });
    MONGO_URL
        ? await mongoose_1.default.connect(MONGO_URL)
        : console.error("No MONGO_URL set!");
}
exports.mongoConnect = mongoConnect;
async function mongoDisconnect() {
    await mongoose_1.default.disconnect();
}
exports.mongoDisconnect = mongoDisconnect;
