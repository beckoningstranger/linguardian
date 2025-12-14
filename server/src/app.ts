import api from "@/routes/api";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "@/config/env";
import { errorHandler } from "@/middleware/error-handler.middleware";
import { notFoundHandler } from "@/middleware/not-found.middleware";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: env.FRONTEND_URL,
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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
