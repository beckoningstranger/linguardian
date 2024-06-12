import getUserOnServer from "./getUserOnServer";

export async function getUserLanguagesWithFlags() {
  const sessionUser = await getUserOnServer();
  const userLanguagesWithFlags = [];
  sessionUser.isLearning.map((obj) => userLanguagesWithFlags.push(obj));
  userLanguagesWithFlags.push(sessionUser.native);
  return userLanguagesWithFlags;
}
