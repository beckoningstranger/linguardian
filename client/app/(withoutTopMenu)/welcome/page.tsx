import Onboarding from "@/components/Onboarding/Onboarding";
import { getAllLanguageFeatures } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Welcome",
};

export default async function Welcome() {
  const [user, allLanguageFeatures] = await Promise.all([
    getUserOnServer(),
    getAllLanguageFeatures(),
  ]);

  if (!user || !allLanguageFeatures) throw new Error("Error fetching data");

  if (user.native && user.learnedLanguages && user.learnedLanguages?.length > 0)
    redirect("/");

  return (
    <div className="relative grid h-screen">
      <div className="mt-32 flex flex-col">
        <h1 className="absolute left-0 top-0 flex h-32 w-full items-center justify-center px-1 font-dancing text-3xl font-bold tracking-wide sm:text-6xl">
          Welcome to Linguardian!
        </h1>
        <Onboarding allLanguageFeatures={allLanguageFeatures} />
      </div>
    </div>
  );
}
