import bcrypt from "bcryptjs";
import { Account, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { createUser } from "@/lib/actions";
import { getUserByEmail, getUserById } from "@/lib/fetchData";
import { LanguageWithFlagAndName, User } from "@/lib/types";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

if (!GOOGLE_ID || !GOOGLE_SECRET)
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
        token.username = user.name;
        token.image = user.image;
        token.id =
          account.provider === "credentials"
            ? user.id
            : account.provider + account.providerAccountId;
      }
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (!token.native || !token.learnedLanguages) {
        const updatedToken = addUserDataToToken(token as any);
        return updatedToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.native = token.native;
      session.user.learnedLanguages = token.learnedLanguages;
      session.user.usernameSlug = token.usernameSlug;
      session.user.learnedLists = token.learnedLists;
      session.user.customSRSettings = token.customSRSettings;
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

            if (profile && profile.name && profile.email) {
              await createUser({
                id,
                // Tacking on these numbers will seem random to users. It gives us a
                // reasonably high probability that they get a unique username
                username:
                  profile.name + account.providerAccountId.slice(-7, -3),
                email: profile.email,
                image: profile?.picture,
              });
            }
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

type Token = Omit<User, "native"> & {
  picture: string;
  sub: string;
  image: string;
  username: string;
  native: LanguageWithFlagAndName | undefined;
};

async function addUserDataToToken(token: Token) {
  const userData = await getUserById(token.id);
  if (userData) {
    if (!token.native && userData?.native) token.native = userData.native;
    token.learnedLanguages = userData.learnedLanguages || [];
    token.learnedLists = userData?.learnedLists || {};
    token.usernameSlug = userData?.usernameSlug;
    token.username = userData.username;
    token.customSRSettings = userData.customSRSettings;
    token.activeLanguageAndFlag = userData?.learnedLanguages[0];
  }
  return token;
}
