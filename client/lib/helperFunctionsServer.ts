import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import {
  LanguageWithFlagAndName,
  SeperatedUserLanguages,
  SupportedLanguage,
  User,
} from "@/lib/types";
import { getServerSession } from "next-auth";
import { getList, getSupportedLanguages } from "./fetchData";

export async function getUserOnServer() {
  const session = await getServerSession(authOptions);
  return session?.user as User;
}

export async function getAllUserLanguages() {
  const user = await getUserOnServer();
  return [user.native, ...user.learnedLanguages] as LanguageWithFlagAndName[];
}

export async function getSeperatedUserLanguages() {
  const user = await getUserOnServer();
  return {
    native: user.native,
    learnedLanguages: user.learnedLanguages,
  } as SeperatedUserLanguages;
}

export async function checkPassedLanguageAsync(
  passedLanguage: string | undefined
) {
  const supportedLanguages = await getSupportedLanguages();
  if (!supportedLanguages) throw new Error(`Could not get supported languages`);
  if (!supportedLanguages.includes(passedLanguage as SupportedLanguage))
    throw new Error(`${passedLanguage} is not a valid language`);
}

export async function getUserAndVerifyUserIsLoggedIn(errorMessage: string) {
  const [user] = await Promise.all([getUserOnServer()]);
  if (!user) throw new Error(errorMessage);
  return user;
}

export async function verifyUserIsAuthorAndGetList(
  listNumber: number,
  errorMessage: string
) {
  const list = await getList(listNumber);
  const [user] = await Promise.all([getUserOnServer()]);
  if (!list?.authors.includes(user.id)) throw new Error(errorMessage);
  return list;
}
