import { ReactNode } from "react";
import { SidebarContextProvider } from "@/context/SidebarContext";
import { UserContextProvider } from "@/context/UserContext";
import { getUserOnServer } from "@/lib/utils/server";
import { allLanguageFeatures } from "@linguardian/shared/constants";
import type { LanguageWithFlagAndName } from "@linguardian/shared/contracts";

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<Record<string, string>>;
}

export default async function LayoutWithTopM({
  children,
  params,
}: RootLayoutProps) {
  const user = await getUserOnServer();
  const resolvedParams = await params;
  const initialActiveLanguage =
    resolveActiveLanguageFromParams(resolvedParams) ??
    user?.activeLanguageAndFlag ??
    null;

  return (
    <UserContextProvider
      initialUser={user}
      initialActiveLanguage={initialActiveLanguage}
    >
      <SidebarContextProvider>
        {children}
        <div id="PortalOutlet" />
      </SidebarContextProvider>
    </UserContextProvider>
  );
}

function resolveActiveLanguageFromParams(
  params: Record<string, string>
): LanguageWithFlagAndName | null {
  const langCode = params.langCode ?? params.language;
  if (!langCode) return null;
  const normalized = langCode.toUpperCase();
  const language = allLanguageFeatures.find(
    (lang) => lang.langCode === normalized
  );
  if (!language) return null;
  return {
    name: language.langName,
    code: language.langCode,
    flag: language.flagCode,
  };
}
