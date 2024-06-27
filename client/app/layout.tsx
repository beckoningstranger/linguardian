import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import { ReactNode } from "react";
import { AuthProvider } from "./Providers";
import { ActiveLanguageProvider } from "@/context/ActiveLanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | Linguardian", default: "Linguardian" },
  description: "Enrich your vocabulary with the power of spaced repetition",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ActiveLanguageProvider activeLanguage="">
          <AuthProvider>{children}</AuthProvider>
        </ActiveLanguageProvider>
      </body>
    </html>
  );
}
