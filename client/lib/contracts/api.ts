import { z } from "zod";
import { supportedLanguageSchema } from "./common";

/** ----------- API Responses ----------- */
export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const baseMessageResponseSchema = z.object({
  type: z.enum(["message", "item", "duplicate"]),
  message: z.string(),
});

export const messageResponseSchema = baseMessageResponseSchema.extend({
  type: z.literal("message"),
});
export const messageWithItemInfoResponseSchema =
  baseMessageResponseSchema.extend({
    type: z.literal("itemInfo"),
    itemInfo: z.object({
      id: z.string(),
      slug: z.string(),
      language: supportedLanguageSchema,
    }),
  });

export const messageWithSlugResponseSchema = baseMessageResponseSchema.extend({
  type: z.literal("duplicate"),
  redirectSlug: z.string(),
});

export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type MessageWithItemInfoResponse = z.infer<
  typeof messageWithItemInfoResponseSchema
>;
export type MessageWithSlugResponse = z.infer<
  typeof messageWithSlugResponseSchema
>;
export type ApiError = z.infer<typeof apiErrorSchema>;

/** ----------- Additional Types that are not inferred----------- */

// ─────────────────────────────────────────────────────────────
// API Response Types
// We use a consistent ApiResponse<T> wrapper for all responses,
// including successful deletes and updates.
//
// While RESTful conventions suggest using `204 No Content` for
// successful DELETEs (and sometimes PATCHs), we return `200 OK`
// with a structured body for consistency with our typed response
// system and better DX.
//
// This tradeoff improves clarity, allows meaningful messages,
// and avoids breaking expectations in client code.
//
// If strict REST compliance were required (e.g. for a public API),
// we could adapt this model accordingly.
// ────────────────────────────────────────────────────────────
export type ApiSuccess<T> = { success: true; data: T };
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
