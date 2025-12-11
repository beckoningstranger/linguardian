import { Response } from "express";
import logger from "@/lib/logger";
import { Types } from "mongoose";
import { z, ZodError } from "zod";

import {
  ApiError,
  ApiResponse,
  ApiSuccess,
  OAuthProvider,
  oAuthProviders,
  PartOfSpeech,
  SupportedLanguage,
} from "@/lib/contracts";
import { SafeDbReadOptions, SafeDbWriteOptions } from "@/lib/types";
import { ItemModel, UserModel } from "@/models";

export async function slugifyString(
  string: string,
  languageCode?: SupportedLanguage,
  partOfSpeech?: PartOfSpeech
): Promise<string> {
  const cleaned = string
    .replace(/[^a-z0-9äöüàáâéèêíìîóòôûúùýỳŷãõũỹ _-]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const baseSlug = [
    languageCode?.toUpperCase(),
    cleaned,
    partOfSpeech?.toLowerCase(),
  ]
    .filter(Boolean)
    .join("-");

  // Fetch all slugs that start with baseSlug
  const regex = new RegExp(`^${baseSlug}(-\\d+)?$`);
  const existingSlugs = await ItemModel.find({ slug: regex }).distinct("slug");

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  // Find the next available suffix
  let counter = 1;
  let slug;
  do {
    slug = `${baseSlug}-${counter++}`;
  } while (existingSlugs.includes(slug));

  return slug;
}

export async function generateUniqueUsernameSlug(
  username: string
): Promise<string> {
  const baseSlug = await slugifyString(username);

  // Fetch all existing username slugs that start with the baseSlug
  const regex = new RegExp(`^${baseSlug}(-\\d+)?$`);
  const existingSlugs = await UserModel.find({ usernameSlug: regex }).distinct(
    "usernameSlug"
  );

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  // Find the next available suffix
  let counter = 1;
  let slug;
  do {
    slug = `${baseSlug}-${counter++}`;
  } while (existingSlugs.includes(slug));

  return slug;
}

export function normalizeString(string: string): string {
  return string
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function formatZodErrors(error: ZodError): string {
  const formatted = error.format();
  const messages: string[] = [];

  function walk(
    errorObj: Record<string, unknown> | { _errors: string[] },
    path: string[] = []
  ) {
    for (const [key, value] of Object.entries(errorObj)) {
      if (key === "_errors" && Array.isArray(value)) {
        const fieldPath = path.join(".");
        for (const message of value) {
          messages.push(`${fieldPath || "(root)"}: ${message}`);
        }
      } else if (
        typeof value === "object" &&
        value !== null &&
        "_errors" in value
      ) {
        walk(value as any, [...path, key]);
      }
    }
  }

  walk(formatted);

  return messages.join("\n");
}

export function successResponse<T>(
  res: Response,
  status: number = 200,
  data: T
) {
  const response: ApiSuccess<T> = {
    success: true,
    data,
  };
  return res.status(status).json(response);
}

export function successMessageResponse(
  res: Response,
  status: number = 200,
  message: string
) {
  return res
    .status(status)
    .json({ success: true, data: { type: "message", message } });
}

export function errorResponse(res: Response, status: number, error: string) {
  const response: ApiError = { success: false, error: error };
  return res.status(status).json(response);
}

export function isOAuthProvider(method: string): method is OAuthProvider {
  return oAuthProviders.includes(method as OAuthProvider);
}

export async function safeDbRead<T>(
  options: SafeDbReadOptions<T>
): Promise<ApiResponse<T>> {
  // Always use .lean() on the dbReadQuery!

  // This returns {success:false} both if something went wrong AND if no results were found
  // In cases where we need to clearly distinguish between these cases, use helper function isNoResultError
  const {
    dbReadQuery,
    schemaForValidation,
    errorMessage = "An unexpected error occurred",
  } = options;

  try {
    const response = await dbReadQuery();
    const noResult = response == null; // catches both null and undefined. undefined should never be there, but just in case
    const emptyArray = Array.isArray(response) && response.length === 0;

    if (emptyArray) return { success: true, data: [] as T };

    if (noResult) {
      return {
        success: false,
        error: "No result found",
      };
    }

    const processed = replaceObjectIdsWithStrings(response);
    const parsed = schemaForValidation.safeParse(processed);

    if (!parsed.success) {
      const formattedErrors = formatZodErrors(parsed.error);

      return {
        success: false,
        error: `Validation failed: ${formattedErrors}`,
      };
    }

    return {
      success: true,
      data: parsed.data,
    };
  } catch (err) {
    logger.error("safeDbRead error", { error: err });
    return {
      success: false,
      error: (err as Error).message ?? errorMessage,
    };
  }
}

export async function safeDbWrite<S extends z.ZodTypeAny, T>({
  input,
  schemaForValidation,
  dbWriteQuery,
  errorMessage = "An unexpected database write error occurred",
}: SafeDbWriteOptions<S, T>): Promise<ApiResponse<T>> {
  const parsed = schemaForValidation.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: `${errorMessage}: Input validation failed: ${formatZodErrors(
        parsed.error
      )}`,
    };
  }

  try {
    const data = await dbWriteQuery(parsed.data);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: `${errorMessage}: ${(err as Error).message}`,
    };
  }
}

export function isNoResultError<T>(response: ApiResponse<T>): boolean {
  return !response.success && response.error === "No result found";
}

export function replaceObjectIdsWithStrings<T>(input: T): T {
  function helper(val: any): any {
    // Convert ObjectId immediately
    if (val instanceof Types.ObjectId) return val.toHexString();

    // Recurse into arrays
    if (Array.isArray(val)) return val.map(helper);

    // Recurse into plain objects
    if (
      val &&
      typeof val === "object" &&
      !(val instanceof Date) &&
      !(val instanceof RegExp)
    ) {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(val)) {
        result[key] = helper(value);
      }
      return result;
    }

    // Return primitives as-is
    return val;
  }

  return helper(input);
}

export function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}

/**
 * Shuffles an array in place using the Durstenfeld algorithm (optimized Fisher-Yates).
 */
export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
