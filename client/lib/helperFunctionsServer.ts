import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import {
  ItemToLearn,
  ItemWithPopulatedTranslations,
  LanguageWithFlagAndName,
  LearningMode,
  SeperatedUserLanguages,
  User,
} from "@/lib/types";
import { getServerSession } from "next-auth";
import { getList, getUserById } from "./fetchData";

export async function getUserOnServer() {
  const session = await getServerSession(authOptions);
  return (await getUserById(session?.user.id)) as User;
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

export async function getUserAndVerifyUserIsLoggedIn(errorMessage: string) {
  const user = await getUserOnServer();
  if (!user) throw new Error(errorMessage);
  return user;
}

export async function verifyUserIsAuthorAndGetList(
  listNumber: number,
  errorMessage: string
) {
  const list = await getList(listNumber);
  const user = await getUserOnServer();
  if (!list?.authors.includes(user.id)) throw new Error(errorMessage);
  return list;
}

export function prepareItemsForSession(
  mode: LearningMode,
  itemsToLearn: ItemWithPopulatedTranslations[]
): ItemToLearn[] {
  const allLearnableItems: ItemToLearn[] = [];
  const allReviewableItems: ItemToLearn[] = [];
  itemsToLearn.forEach((unitItem) => {
    const item = unitItem as ItemToLearn;
    item.increaseLevel = true;
    if (mode === "learn") {
      item.learningStep = 0;
      allLearnableItems.push(item);
    }
    if (mode === "translation") {
      item.learningStep = 3;
      allReviewableItems.push(item);
    }
  });

  switch (mode) {
    case "translation":
      return allReviewableItems;
    case "learn":
      return allLearnableItems;
    default:
      console.error("No valid learning mode");
      return [];
  }
}
