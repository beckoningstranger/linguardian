import api from "@/routes/api";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET || !FRONTEND_URL) throw new Error("Environment not set");

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(morgan("combined"));

// Do not JSON parse multipart/form-data
app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.startsWith("multipart/form-data")) {
    return next();
  }
  express.json()(req, res, next);
});

app.use("/", api);
export default app;
