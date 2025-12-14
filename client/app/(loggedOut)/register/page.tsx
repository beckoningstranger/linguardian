import { redirect } from "next/navigation";

import RegisterForm from "@/components/authentication/RegisterForm";
import paths from "@/lib/paths";
import { getUserOnServer } from "@/lib/utils/server";

export const metadata = {
    title: "Create an account",
};

export default async function RegisterPage() {
    const user = await getUserOnServer();
    if (!user)
        return (
            <div className="fixed bottom-0 right-0 min-w-full tablet:min-w-[500px]">
                <RegisterForm />
            </div>
        );

    if (!user.native || !user.learnedLanguages) {
        redirect(paths.welcomePath());
    }

    redirect(paths.dashboardLanguagePath(user.learnedLanguages[0].code));
}
