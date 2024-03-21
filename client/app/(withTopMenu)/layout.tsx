import {
  getAllLanguageFeatures,
  getSupportedLanguages,
  getUserById,
} from "@/app/actions";
import DashboardContainer from "@/components/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import { ReactNode } from "react";

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
  const user = await getUserById(1);
  const allSupportedLanguages = await getSupportedLanguages();
  const allLanguageFeatures = await getAllLanguageFeatures();
  if (user && allSupportedLanguages && allLanguageFeatures)
    return (
      <html lang="en">
        <body className={inter.className}>
          <TopMenu
            user={user}
            allSupportedLanguages={allSupportedLanguages}
            allLanguageFeatures={allLanguageFeatures}
          />
          <DashboardContainer>
            {children}
            <div id="PortalOutlet" />
          </DashboardContainer>
        </body>
      </html>
    );
  return "No User or connection lost.";
}
