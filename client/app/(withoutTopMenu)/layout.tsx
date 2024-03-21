import { ReactNode } from "react";
import { MobileMenuContextProvider } from "@/components/Menus/MobileMenu/MobileMenuContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Linguardian",
  description: "Enrich your vocabulary with the power of spaced repetition",
};

export default async function Root({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MobileMenuContextProvider>{children}</MobileMenuContextProvider>
        <div id="PortalOutlet" />
      </body>
    </html>
  );
}
