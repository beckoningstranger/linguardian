import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { SessionUser } from "@/types";
import { getServerSession } from "next-auth";

export default async function getUserOnServer() {
  const session = await getServerSession(authOptions);
  return session?.user as SessionUser;
}
