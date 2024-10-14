import "@/app/globals.css";
import {
  breeSerif,
  dancingScript,
  playfairDisplay,
  poppins,
} from "@/lib/fonts";
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
        className={`${dancingScript} ${poppins} ${breeSerif} ${playfairDisplay} font-breeSerif font-light text-lg tracking-wider `}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" reverseOrder={true} />
      </body>
    </html>
  );
}
