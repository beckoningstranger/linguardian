import LoginForm from "@/components/authentication/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function Root() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
