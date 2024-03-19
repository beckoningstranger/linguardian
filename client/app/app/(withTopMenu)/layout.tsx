import { getSupportedLanguages, getUserById } from "../../actions";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import DashboardContainer from "@/components/DashboardContainer";
import { SupportedLanguage } from "@/types";
import { ReactNode } from "react";
import { MobileMenuContextProvider } from "@/components/Menus/MobileMenu/MobileMenuContext";

interface AppLayoutProps {
  searchParams?: { lang: SupportedLanguage };
  children: ReactNode;
}

export default async function AppLayout({
  searchParams,
  children,
}: AppLayoutProps) {
  const user = await getUserById(1);
  const validPassedLanguage = await checkPassedLanguage(
    searchParams?.lang?.toUpperCase()
  );

  if (user)
    return (
      <>
        {validPassedLanguage && (
          <TopMenu user={user} currentlyActiveLanguage={validPassedLanguage} />
        )}
        {!validPassedLanguage && (
          <MobileMenuContextProvider>
            <TopMenu
              user={user}
              currentlyActiveLanguage={user.languages[0].code}
            />
          </MobileMenuContextProvider>
        )}
        <DashboardContainer>
          {children}
          <div id="PortalOutlet" />
        </DashboardContainer>
      </>
    );

  return "No user";
}

export async function checkPassedLanguage(passedLanguage: string | undefined) {
  const supportedLanguages = await getSupportedLanguages();
  if (
    !passedLanguage ||
    !supportedLanguages ||
    !supportedLanguages.includes(passedLanguage as SupportedLanguage)
  )
    return false;
  return passedLanguage as SupportedLanguage;
}
