import { z } from "zod";

import {
  ApiResponse,
  OAuthProvider,
  OAuthProviderSchema,
} from "@linguardian/shared/contracts";
import { executeActionParams } from "@/lib/types";
import { formatZodErrors } from "@/lib/utils";
import { getAccessToken, userIsAuthenticated } from "@/lib/utils/server";
import { getUserFriendlyErrorMessage } from "@/lib/utils/errors";

/**
 * Executes an API call and validates the response using a provided Zod schema.
 *
 * @template T - The expected shape of the validated response data.
 * @param {() => Promise<Response>} fetchCall - A function that performs the fetch request.
 * @param {z.ZodType<T>} schema - Zod schema to validate the API response `data` field.
 * @returns {Promise<ApiResponse<T>>} A promise resolving to an ApiResponse containing either valid data or formatted errors.
 */
export async function handleApiCall<T>(
  fetchCall: () => Promise<Response>,
  schema: z.ZodType<T>
): Promise<ApiResponse<T>> {
  try {
    const response = await fetchCall();
    const json: ApiResponse<unknown> = await response.json();

    if (!response.ok || !json.success) {
      return {
        success: false,
        error: await getUserFriendlyErrorMessage(json, response.status),
      };
    }

    const result = schema.safeParse(json.data);
    if (!result.success) {
      return {
        success: false,
        error: formatZodErrors(result.error),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return {
        success: false,
        error: "Request aborted",
      };
    }
    return {
      success: false,
      error: (err as Error).message || "Unknown error occurred",
    };
  }
}

export async function handleApiCallWithAuth<T>(
  fetchCall: (headers: HeadersInit) => Promise<Response>,
  schema: z.ZodType<T>
): Promise<ApiResponse<T>> {
  try {
    const accessToken = await getAccessToken();

    const authHeaders: HeadersInit = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const response = await fetchCall(authHeaders);
    const json: ApiResponse<unknown> = await response.json();

    if (!response.ok || !json.success) {
      return {
        success: false,
        error: await getUserFriendlyErrorMessage(json, response.status),
      };
    }

    // ✅ Just let Zod handle the union internally
    const result = schema.safeParse(json.data);
    if (!result.success) {
      return {
        success: false,
        error: formatZodErrors(result.error),
      };
    }

    return { success: true, data: result.data };
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return { success: false, error: "Request aborted" };
    }
    return {
      success: false,
      error: (err as Error).message || "Unknown error occurred",
    };
  }
}

/** Verifies that a string is a valid and supported OAuthProvider */
export function parseOAuthProvider(provider: string): OAuthProvider | null {
  const result = OAuthProviderSchema.safeParse(provider);
  return result.success ? result.data : null;
}

export function throwErrorForToastPromise<T>(errors: string | string[]): never {
  const message = typeof errors !== "string" ? errors.join(",") : errors;

  throw new Error(message);
}

export async function executeAuthenticatedAction<T>({
  apiCall,
  onSuccess,
}: executeActionParams<T>): Promise<T> {
  await userIsAuthenticated();

  const response = await apiCall();

  if (!response.success) {
    throwErrorForToastPromise(response.error);
  }

  if (onSuccess) {
    await onSuccess(response.data);
  }
  return response.data;
}

export async function executeAction<T>({
  apiCall,
  onSuccess,
}: executeActionParams<T>): Promise<T> {
  const response = await apiCall();

  if (!response.success) {
    throwErrorForToastPromise(response.error);
  }

  if (onSuccess) {
    await onSuccess(response.data);
  }
  return response.data;
}
