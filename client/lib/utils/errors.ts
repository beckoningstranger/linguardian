import { apiErrorSchema } from "@linguardian/shared/contracts";

/**
 * Extracts error messages from an API response.
 * Safe for both server and client/edge by avoiding direct `process` access.
 */
export async function getUserFriendlyErrorMessage(
  json: unknown,
  status: number
): Promise<string> {
  const result = apiErrorSchema.safeParse(json);
  const error = result.success ? result.data.error : null;

  const isDev =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "development") ||
    (typeof window !== "undefined" &&
      // Next injects this flag in dev; guard with boolean cast to avoid TS errors.
      Boolean((window as any).__NEXT_DEV_CLIENT__));

  if (isDev) console.error("API Error:", { status, error, raw: json });
  if (error) return error;

  switch (status) {
    case 400:
      return "Your request was invalid. Please report this to our team.";
    case 401:
      return "Please log in to continue.";
    case 403:
      return "You don’t have permission to perform this action.";
    case 404:
      return "We couldn’t find what you were looking for.";
    case 500:
      return "Something went wrong on our side. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}
