import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import { ReactNode } from "react";
import { AuthProvider } from "./Providers";
import { Toaster } from "react-hot-toast";

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
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" reverseOrder={true} />
      </body>
    </html>
  );
}
