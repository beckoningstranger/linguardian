import "@/app/globals.css";
import { dancingScript, playfairDisplay, inter, voces } from "@/lib/fonts";
import type { Metadata } from "next";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Providers";

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
      <body
        className={`${dancingScript} ${inter} ${playfairDisplay} ${voces} font-sans`}
      >
        <AuthProvider>{children}</AuthProvider>
        <div className="hidden tablet:block">
          <Toaster position="top-right" reverseOrder={true} />
        </div>
        <div className="tablet:hidden">
          <Toaster position="top-center" reverseOrder={true} />
        </div>
      </body>
    </html>
  );
}
