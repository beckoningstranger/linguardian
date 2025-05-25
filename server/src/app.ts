import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import api from "./routes/api";

const app = express();
const FRONTEND_URL = process.env.FRONTEND;

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use("/", api);

export default app;
