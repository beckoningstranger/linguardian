import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { SessionUser, SupportedLanguage } from "@/types";
import { getServerSession } from "next-auth";
import { getSupportedLanguages } from "./fetchData";

export default async function getUserOnServer() {
  const session = await getServerSession(authOptions);
  return session?.user as SessionUser;
}

export async function getUserLanguagesWithFlags() {
  const sessionUser = await getUserOnServer();
  const userLanguagesWithFlags = [];
  if (sessionUser.native) userLanguagesWithFlags.push(sessionUser.native);
  if (sessionUser.isLearning)
    sessionUser.isLearning.forEach((obj) => userLanguagesWithFlags.push(obj));
  return userLanguagesWithFlags;
}

export function slugify(title: string): string {
  return title
    .replace(/[^äöüàáâéèêíìîóòôûúùýỳŷãõũỹa-zA-Z!()': }]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export async function checkPassedLanguageAsync(
  passedLanguage: string | undefined
) {
  const supportedLanguages = await getSupportedLanguages();
  if (
    !passedLanguage ||
    !supportedLanguages ||
    !supportedLanguages.includes(passedLanguage as SupportedLanguage)
  ) {
    return null;
  }
  return passedLanguage as SupportedLanguage;
}
