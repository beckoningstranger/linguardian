import { LearnedItem, List, SupportedLanguage, User } from "../types.js";
import Users from "./users.schema.js";

export async function getUserById(id: number) {
  try {
    const response = await Users.findOne<User>({ id: id }, { _id: 0 });
    if (response) {
      return response;
    }
  } catch (err) {
    console.error(`Error getting user: ${err}`);
  }
}

export async function createUser(user: User) {
  try {
    await Users.findOneAndUpdate<User>({ id: user.id }, user, { upsert: true });
  } catch (err) {
    console.error(`Error creating user. ${err}`);
  }
}

export async function getUserWithPopulatedLearnedLists(
  userId: number,
  language: SupportedLanguage
) {
  try {
    return await Users.findOne<User>(
      { id: userId },
      { languages: 1, _id: 0 }
    ).populate<{
      languages: {
        code: SupportedLanguage;
        name: string;
        flag: string;
        learnedItems: LearnedItem[];
        learnedLists: List[];
      };
    }>({ path: `languages.${language}.learnedLists` });
  } catch (err) {
    console.error(`Error getting learned lists for language ${language}`);
  }
}
