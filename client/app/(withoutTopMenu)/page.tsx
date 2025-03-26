import LandingPageContent from "@/components/authentication/LandingPageContent";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function Root() {
  const user = await getUserOnServer();
  if (user?.learnedLanguages)
    redirect(paths.dashboardLanguagePath(user.learnedLanguages[0].code));

  return (
    <div className="relative h-screen select-none bg-[url('/backgrounds/landingPageBackground.webp')] bg-cover bg-center">
      <div className="h-screen bg-gradient-to-b from-white/0 via-white/0 via-50% to-black/80 to-100%">
        <LandingPageContent />
      </div>
    </div>
  );
}
