import "@/app/globals.css";
import { dancingScript, inter, playfairDisplay, voces } from "@/lib/fonts";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import AuthProvider from "@/components/AuthProvider";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { UserContextProvider } from "@/context/UserContext";
import { getUserOnServer } from "@/lib/utils/server";
import { TopContextMenuContextProvider } from "@/context/TopContextMenuContext";
import { KeyboardContextProvider } from "@/context/KeyboardContext";

export const metadata: Metadata = {
  title: { template: "%s | Linguardian", default: "Linguardian" },
  description: "Enrich your vocabulary with the power of spaced repetition",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      {
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
  manifest: "/site.webmanifest",
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
            <TopContextMenuContextProvider>
              <MobileMenuContextProvider>
                <main>{children}</main>
              </MobileMenuContextProvider>
            </TopContextMenuContextProvider>
          </UserContextProvider>
        </AuthProvider>
        <Toaster position="top-center" reverseOrder={true} />
      </body>
    </html>
  );
}
