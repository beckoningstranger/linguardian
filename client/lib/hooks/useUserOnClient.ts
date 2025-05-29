import { useSession } from "next-auth/react";
import { User } from "../types";

export default function useUserOnClient() {
  const session = useSession();
  if (!session.data) throw new Error("Could not get user on client");
  return session.data?.user as User;
}
