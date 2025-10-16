import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Onboarding } from "@/components";
import paths from "@/lib/paths";
import { getUserOnServer } from "@/lib/utils/server";

export const metadata: Metadata = {
  title: "Welcome",
};

export default async function Welcome() {
  const user = await getUserOnServer();

  if (user?.completedOnboarding)
    redirect(paths.dashboardLanguagePath(user.activeLanguageAndFlag.code));

  return (
    <div className="relative grid h-screen">
      <div className="mt-32 flex flex-col bg-white/50">
        <h1 className="absolute left-0 top-0 flex h-32 w-full items-center justify-center bg-white/50 px-1 font-script font-bold tracking-wide phone:text-6xl">
          Welcome to Linguardian!
        </h1>
        <Onboarding />
      </div>
    </div>
  );
}
