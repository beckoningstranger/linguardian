import DashboardContainer from "@/components/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linguardian",
  description: "Enrich your vocabulary with the power of spaced repetition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopMenu />
      <DashboardContainer>{children}</DashboardContainer>
    </>
  );
}
