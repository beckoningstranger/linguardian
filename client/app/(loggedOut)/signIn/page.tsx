import { redirect } from "next/navigation";

import LoginForm from "@/components/authentication/LoginForm";
import paths from "@/lib/paths";
import { getUserOnServer } from "@/lib/utils";

export const metadata = { title: "Sign in" };

export default async function SignInPage() {
    const user = await getUserOnServer();

    if (!user)
        return (
            <div className="fixed bottom-0 right-0 min-w-full tablet:min-w-[500px]">
                <LoginForm />
            </div>
        );

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
