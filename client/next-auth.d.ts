import NextAuth from "next-auth/next";
import { LearnedLanguage, SupportedLanguage } from "./types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & Session["user"];
  }
}
