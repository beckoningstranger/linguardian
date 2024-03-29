import express from "express";
import cors from "cors";
import morgan from "morgan";

import api from "./routes/api.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));
app.use(express.json());
app.use("/", api);

export default app;
