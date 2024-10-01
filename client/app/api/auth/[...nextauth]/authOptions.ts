import bcrypt from "bcryptjs";
import { Account, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FaceBookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import { createUser } from "@/lib/actions";
import {
  getAllLearnedListsForUser,
  getLanguageFeaturesForLanguage,
  getUserByEmail,
  getUserById,
} from "@/lib/fetchData";
import {
  LanguageWithFlag,
  LanguageWithFlagAndName,
  LearnedLanguage,
  SupportedLanguage,
} from "@/lib/types";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const FACEBOOK_ID = process.env.FACEBOOK_ID;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;

if (!GOOGLE_ID || !GOOGLE_SECRET || !FACEBOOK_ID || !FACEBOOK_SECRET)
  throw new Error("Error getting environment variables");

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          const user = await getUserByEmail(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;
          user.name = user.username; // Just to have it in the token as it's called differently in the user schema
          return user;
        } catch (err) {
          console.error("Error during login", err);
        }
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    FaceBookProvider({ clientId: FACEBOOK_ID, clientSecret: FACEBOOK_SECRET }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user && account) {
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.id =
          account.provider === "credentials"
            ? user.id
            : account.provider + account.providerAccountId;
      }
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (!token.native || !token.isLearning) {
        const updatedToken = addUserDataToToken(token as any);
        return updatedToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.native = token.native;
      session.user.isLearning = token.isLearning;
      session.user.usernameSlug = token.usernameSlug;
      session.user.learnedLists = token.learnedLists;
      if (!session.user.activeLanguage)
        session.user.activeLanguageAndFlag = token.activeLanguageAndFlag;
      return session;
    },
    async signIn({
      profile,
      account,
    }: {
      profile?: ProfileExtended | undefined;
      account: Account | null;
    }) {
      try {
        if (account && account.provider !== "credentials") {
          const id = account.provider + account.providerAccountId;
          const idExists = await getUserById(id);

          if (!idExists) {
            if (!account) throw new Error("No account found");

            if (profile && profile.name && profile.email && profile.picture)
              await createUser({
                id,
                username: profile.name,
                email: profile?.email,
                image: profile?.picture,
              });
          }
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  },
};

export default authOptions;

interface ProfileExtended {
  sub?: string;
  name?: string;
  email?: string;
  image?: string;
  picture?: string;
}

interface Token {
  name: string;
  email: string;
  picture: string;
  sub: string;
  image: string;
  id: string;
  native: LanguageWithFlagAndName | undefined;
  isLearning: LanguageWithFlagAndName[];
  usernameSlug: string | undefined;
  learnedLists: Record<SupportedLanguage, number[]> | never[];
  activeLanguageAndFlag: LanguageWithFlag;
}

async function addUserDataToToken(token: Token) {
  const userData = await getUserById(token.id);

  if (!token.native && userData?.native) {
    const languageFeatures = await getLanguageFeaturesForLanguage(
      userData.native
    );
    if (!languageFeatures) throw new Error("Failed to fetch language features");
    token.native = {
      name: userData.native,
      flag: languageFeatures?.flagCode,
      langName: languageFeatures.langName,
    };
  }
  if (
    !token.isLearning &&
    userData?.languages &&
    userData.languages.length > 0
  ) {
    const userIsLearning: LanguageWithFlagAndName[] = userData.languages.map(
      (lang: LearnedLanguage) => ({
        name: lang.code,
        flag: lang.flag,
        langName: lang.name,
      })
    );
    token.isLearning = userIsLearning;
  }
  token.learnedLists = await getAllLearnedListsForUser(token.id);
  token.usernameSlug = userData?.usernameSlug;
  if (token.isLearning) token.activeLanguageAndFlag = token.isLearning[0];
  return token;
}
