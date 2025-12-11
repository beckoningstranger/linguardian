import winston from "winston";

import { env } from "@/lib/env";

/**
 * Log levels (from most to least severe):
 * - error: Error events that might still allow the app to continue
 * - warn: Warning messages for potentially harmful situations
 * - info: Informational messages about general application flow
 * - http: HTTP request/response logging
 * - verbose: Detailed information for debugging
 * - debug: Very detailed information, typically only useful for debugging
 * - silly: The most verbose logging level
 */

const logLevel = env.LOG_LEVEL || (env.NODE_ENV === "production" ? "info" : "debug");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development (pretty printed)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: "linguardian-backend" },
  transports: [
    // Console transport - always enabled
    new winston.transports.Console({
      format: env.NODE_ENV === "production" ? logFormat : consoleFormat,
    }),
  ],
});

// Add file transports in production (optional)
if (env.NODE_ENV === "production" && env.LOG_TO_FILE) {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: logFormat,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      format: logFormat,
    })
  );
}

/**
 * Logger instance with methods:
 * - logger.error(message, meta?)
 * - logger.warn(message, meta?)
 * - logger.info(message, meta?)
 * - logger.http(message, meta?)
 * - logger.verbose(message, meta?)
 * - logger.debug(message, meta?)
 */
export default logger;
