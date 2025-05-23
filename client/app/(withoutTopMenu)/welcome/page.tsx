import Onboarding from "@/components/Onboarding/Onboarding";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Welcome",
};

export default async function Welcome() {
  const [user] = await Promise.all([getUserOnServer()]);

  if (!user) throw new Error("Could not fetch user");

  if (user.native && user.learnedLanguages && user.learnedLanguages?.length > 0)
    redirect("/");

  return (
    <div className="relative grid h-screen">
      <div className="mt-32 flex flex-col">
        <h1 className="absolute left-0 top-0 flex h-32 w-full items-center justify-center px-1 font-script text-3xl font-bold tracking-wide sm:text-6xl">
          Welcome to Linguardian!
        </h1>
        <Onboarding />
      </div>
    </div>
  );
}
