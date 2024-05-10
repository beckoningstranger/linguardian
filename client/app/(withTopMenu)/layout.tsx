import {
  getAllLanguageFeatures,
  getSupportedLanguages,
  getUserById,
} from "@/app/actions";
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import { ReactNode } from "react";
import { AuthProvider } from "../Providers";
import getUserOnServer from "@/lib/getUserOnServer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linguardian",
  description: "Enrich your vocabulary with the power of spaced repetition",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayoutWithTopMenu({
  children,
}: RootLayoutProps) {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  const allSupportedLanguages = await getSupportedLanguages();
  const allLanguageFeatures = await getAllLanguageFeatures();
  if (user && allSupportedLanguages && allLanguageFeatures)
    return (
      <html lang="en">
        <body className={inter.className}>
          <AuthProvider>
            {user.languages[0] && (
              <TopMenu
                user={user}
                allSupportedLanguages={allSupportedLanguages}
                allLanguageFeatures={allLanguageFeatures}
              />
            )}
            <DashboardContainer>
              {children}
              <div id="PortalOutlet" />
            </DashboardContainer>
          </AuthProvider>
        </body>
      </html>
    );
  return "No User or connection lost.";
}
