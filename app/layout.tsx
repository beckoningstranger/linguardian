import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import { GlobalContextProvider } from "./context/GlobalContext";
import SideBarNavigation from "@/components/SideBarNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linguardian",
  description: "Enrich your vocabulary with the power or spaced repetition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalContextProvider>
        <body className={inter.className}>
          <TopMenu />
          <SideBarNavigation />
          <main>{children}</main>
        </body>
      </GlobalContextProvider>
    </html>
  );
}
