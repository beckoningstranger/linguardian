import { EncryptJWT } from "jose";
import type { Session } from "next-auth";
import { Account, NextAuthOptions } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { createUser, loginUser } from "@/lib/api/user-api";
import {
  OAuthProvider,
  oAuthProviders,
  OAuthProviderSchema,
  SessionUser,
} from "@/lib/contracts";
import { randomUUID } from "crypto";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!GOOGLE_ID || !GOOGLE_SECRET || !NEXTAUTH_SECRET)
  throw new Error("Error getting environment variables");

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        const response = await loginUser({
          method: "email",
          id: email,
          password,
        });

        if (!response.success) return null;
        const sessionUser: SessionUser = response.data;
        return sessionUser; // this becomes "user" in jwt() callback
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
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      if (trigger === "update") {
        return { ...token, ...session };
      }

      // Step 1: Set token.id
      if (user && account?.provider) {
        if (account.provider === "credentials") {
          // Use local id directly
          token.id = user.id;
        } else {
          const parsedOAuthProvider = OAuthProviderSchema.safeParse(
            account.provider
          );
          if (!parsedOAuthProvider.success) {
            console.warn(
              `[auth] Unsupported OAuth provider: ${account.provider}`
            );
            return token;
          }
          // Lookup local id using OAuth info
          const response = await loginUser({
            method: parsedOAuthProvider.data,
            id: account.providerAccountId,
          });

          if (response.success) {
            token.id = response.data.id;
          } else {
            console.warn(
              `[auth] Failed to resolve internal user ID for ${account.provider}:${account.providerAccountId}. Received ${response.error}`
            );
            return token;
          }
        }
      }

      // Step 2: Generate accessToken (only once)
      if (!token.accessToken && token.id) {
        const secret = Buffer.from(NEXTAUTH_SECRET, "base64");
        const accessToken = await new EncryptJWT({ id: token.id })
          .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
          .setIssuedAt()
          .setExpirationTime("7d")
          .setJti(randomUUID())
          .encrypt(secret);

        token.accessToken = accessToken;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id,
      };
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({
      profile,
      account,
    }: {
      profile?: ProfileExtended;
      account: Account | null;
    }) {
      if (account?.provider === "credentials") return true;

      if (account && account.provider) {
        if (!isOAuthProvider(account.provider)) return false;
        const response = await loginUser({
          method: account.provider,
          id: account.providerAccountId,
        });
        if (response.success) {
          return true;
        }

        if (profile && profile.name && profile.email) {
          const created = await createUser({
            oauthId: account.providerAccountId,
            // Maybe we even need more normalization for the username, it's the only part
            // users have control over
            username:
              profile.name.length > 4
                ? profile.name.replace(/\s/g, "")
                : (profile.name + "LearnsLanguages").replace(/\s/g, ""),
            email: profile.email,
            registeredVia: account.provider,
            image: profile.picture,
          });

          if (created.success) return true;
        }
      }
      return false;
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

function isOAuthProvider(provider: string): provider is OAuthProvider {
  const oAuthProviderArray: string[] = Array.from(oAuthProviders);
  return oAuthProviderArray.includes(provider);
}
