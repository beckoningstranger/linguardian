import "@/app/globals.css";
import { dancingScript, inter, playfairDisplay, voces } from "@/lib/fonts";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import AuthProvider from "@/components/AuthProvider";
import { UserContextProvider } from "@/context/UserContext";
import { getUserOnServer } from "@/lib/utils/server";

export const metadata: Metadata = {
  title: { template: "%s | Linguardian", default: "Linguardian" },
  description: "Enrich your vocabulary with the power of spaced repetition",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getUserOnServer();

  return (
    <html lang="en">
      <body
        className={`${dancingScript} ${inter} ${playfairDisplay} ${voces} font-sans`}
      >
        <AuthProvider>
          <UserContextProvider initialUser={user}>
            <main>{children}</main>
          </UserContextProvider>
        </AuthProvider>
        <Toaster position="top-center" reverseOrder={true} />
      </body>
    </html>
  );
}
