import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { fetchUser } from "@/lib/api/user-api";
import { User } from "@linguardian/shared/contracts";
import paths from "@/lib/paths";

/**
 * Redirects to the login page if no session is present.
 */
export async function userIsAuthenticated(): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session) redirect(paths.signInPath());
}

/**
 * Returns the currently logged-in user's id based on session.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }
  return null;
}

/**
 * Returns the access token
 */
export async function getAccessToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Could not get access token");
  return session.accessToken;
}

/**
 * Returns the currently logged-in user based on session.
 * Uses tag-based caching to avoid unnecessary backend calls.
 */
export async function getUserOnServer(): Promise<User | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const userResponse = await fetchUser(userId);
  if (!userResponse.success)
    console.error("Failed to fetch user: ", userResponse.error);
  if (userResponse.success) return userResponse.data;
  return null;
}

/**
 * Extracts error messages from an API response.
 */
export { getUserFriendlyErrorMessage } from "@/lib/utils/errors";
