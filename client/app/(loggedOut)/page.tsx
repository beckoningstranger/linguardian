import { getUserOnServer } from "@/lib/utils/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import paths from "@/lib/paths";

export const metadata: Metadata = {
  title: "Welcome",
};

export default async function LandingPage() {
  const user = await getUserOnServer();

  if (!user) {
    return (
      <div className="flex grow flex-col justify-end">
        <div className="px-4 pb-24 text-center font-script text-h2xl tracking-tight text-white tablet:px-12">
          <p className="text-pretty">
            Learning a language is like planting seeds
          </p>
          <p className="text-pretty">
            Start today and see your knowledge blossom
          </p>
        </div>
      </div>
    );
  }

  if (
    user &&
    (!user.completedOnboarding ||
      !user.native ||
      !user.learnedLanguages ||
      !user.learnedLanguages[0] ||
      !user.activeLanguageAndFlag)
  )
    redirect(paths.welcomePath());

  redirect(paths.dashboardLanguagePath(user.activeLanguageAndFlag.code));
}
