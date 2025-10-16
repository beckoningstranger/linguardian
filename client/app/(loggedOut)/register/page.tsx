import { redirect } from "next/navigation";

import { RegisterForm } from "@/components";
import paths from "@/lib/paths";
import { getUserOnServer } from "@/lib/utils";

export const metadata = {
  title: "Create an account",
};

export default async function RegisterPage() {
  const user = await getUserOnServer();
  if (!user)
    return (
      <div className="absolute bottom-0 right-0 min-w-[500px]">
        <RegisterForm />
      </div>
    );

  if (!user.native || !user.learnedLanguages) {
    redirect(paths.welcomePath());
  }

  redirect(paths.dashboardLanguagePath(user.learnedLanguages[0].code));
}
