import LoginForm from "@/components/authentication/LoginForm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Root() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main>
      <LoginForm />
      <Link href="/dashboard">Dashboard</Link>;
    </main>
  );
}
