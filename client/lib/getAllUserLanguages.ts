import getUserOnServer from "./getUserOnServer";

export async function getUserLanguagesWithFlags() {
  const sessionUser = await getUserOnServer();
  const userLanguagesWithFlags = sessionUser.isLearning;
  userLanguagesWithFlags.push(sessionUser.native);
  return userLanguagesWithFlags;
}
