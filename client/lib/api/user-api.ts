import { SERVER } from "@/lib/constants";
import {
  ApiResponse,
  IsTakenParams,
  LearningDataUpdate,
  LoginUserParams,
  MessageResponse,
  messageResponseSchema,
  RegistrationData,
  SessionUser,
  sessionUserSchema,
  User,
  UpdateUser,
  userSchema,
} from "@linguardian/shared/contracts";
import { userTag } from "@/lib/utils";
import { handleApiCall, handleApiCallWithAuth } from "@/lib/utils/api";
import { z } from "zod";

/**
 * Fetches the user by sending a JWT.
 *
 * @param {string} userId - The user ID we use to create a cache tag.
 * @returns {Promise<ApiResponse<User>>} A promise resolving to the fetched user or an error response.
 */
export async function fetchUser(userId: string): Promise<ApiResponse<User>> {
  const url = `${SERVER}/users/me`;

  return handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        headers,
        next: { tags: [userTag(userId)] },
      }),
    userSchema
  );
}

/**
 * Updates the user information.
 *
 * @param {UpdateUser} userData - The data used to update the user.
 * @returns {Promise<ApiResponse<MessageResponse>>} A promise resolving to the updated user ID or an error response.
 */
export async function updateUser(
  userData: UpdateUser
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/users/${userData.id}`;

  return handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }),
    messageResponseSchema
  );
}

export async function loginUser(
  params: LoginUserParams
): Promise<ApiResponse<SessionUser>> {
  const url = `${SERVER}/users/login`;
  return handleApiCall(
    () =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      }),
    sessionUserSchema
  );
}

export async function createUser(
  userData: RegistrationData
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/users/create`;
  return handleApiCall(
    () =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      }),
    messageResponseSchema
  );
}

export async function isTaken(
  request: IsTakenParams
): Promise<ApiResponse<boolean>> {
  const params = new URLSearchParams({
    mode: request.mode,
    value: request.value,
  });
  const url = `${SERVER}/users/isTaken?${params.toString()}`;

  return await handleApiCall(
    () =>
      fetch(url, {
        cache: "no-store",
      }),
    z.boolean()
  );
}

export async function updateLearnedItems(
  update: LearningDataUpdate,
  userId: string
): Promise<ApiResponse<MessageResponse>> {
  const url = `${SERVER}/users/${userId}/learn`;

  return await handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(update),
      }),
    messageResponseSchema
  );
}
