
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"

import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linguardian",
  description: "Enrich your vocabulary with the power of spaced repetition",
};

interface RootLayoutProps {
  children: ReactNode
}

export default async function Root({children}: RootLayoutProps){
    return <html lang="en">
        <body className={inter.className}>
        {children}
        </body>
    </html>
}
