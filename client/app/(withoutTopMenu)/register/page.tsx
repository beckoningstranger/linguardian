import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import RegisterForm from "@/components/authentication/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <div>
      <RegisterForm />
    </div>
  );
}
