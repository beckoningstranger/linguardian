import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts, please try again in 15 minutes.",
  },
});
