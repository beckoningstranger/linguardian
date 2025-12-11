import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const isTest = process.env.NODE_ENV === "test";

// In test mode, provide defaults for required fields
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8000),
  MONGO_URL: isTest
    ? z.string().min(1).default("mongodb://test:27017/test")
    : z.string().min(1, "MONGO_URL is required"),
  NEXTAUTH_SECRET: isTest
    ? z.string().min(1).default("test-secret-key-for-jest-tests-only")
    : z.string().min(1, "NEXTAUTH_SECRET is required"),
  FRONTEND_URL: isTest
    ? z.string().url().default("http://localhost:3000")
    : z.string().url("FRONTEND_URL must be a valid URL"),
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .optional(),
  LOG_TO_FILE: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
});

export const env = envSchema.parse(process.env);
