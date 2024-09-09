import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import {
  SessionUser,
  SupportedLanguage,
  UserLanguagesWithFlags,
} from "@/lib/types";
import { getServerSession } from "next-auth";
import { getSupportedLanguages } from "./fetchData";

export default async function getUserOnServer() {
  const session = await getServerSession(authOptions);
  return session?.user as SessionUser;
}

export async function getAllUserLanguagesWithFlags() {
  const sessionUser = await getUserOnServer();
  const userLanguagesWithFlags = [];
  if (sessionUser.native) userLanguagesWithFlags.push(sessionUser.native);
  if (sessionUser.isLearning)
    sessionUser.isLearning.forEach((languageWithFlag) =>
      userLanguagesWithFlags.push(languageWithFlag)
    );
  return userLanguagesWithFlags;
}

export async function getSeperatedUserLanguagesWithFlags() {
  const sessionUser = await getUserOnServer();
  return {
    native: sessionUser.native,
    isLearning: sessionUser.isLearning,
  } as UserLanguagesWithFlags;
}

export async function getAllUserLanguages() {
  const sessionUser = await getUserOnServer();
  const allLanguages: SupportedLanguage[] = [];
  allLanguages.push(sessionUser.native.name);
  sessionUser.isLearning.forEach((languageWithFlag) =>
    allLanguages.push(languageWithFlag.name)
  );
  return allLanguages;
}

export async function getSeperatedUserLanguages() {
  const sessionUser = await getUserOnServer();
  return {
    native: sessionUser.native,
    isLearning: sessionUser.isLearning.map((lang) => lang),
  } as UserLanguagesWithFlags;
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
