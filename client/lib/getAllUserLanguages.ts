import getUserOnServer from "@/lib/getUserOnServer";

export async function getUserLanguagesWithFlags() {
  const sessionUser = await getUserOnServer();
  if (!sessionUser.isLearning) return [];
  const userLanguagesWithFlags = [];
  sessionUser.isLearning.forEach((obj) => userLanguagesWithFlags.push(obj));
  userLanguagesWithFlags.push(sessionUser.native);
  return userLanguagesWithFlags;
}
