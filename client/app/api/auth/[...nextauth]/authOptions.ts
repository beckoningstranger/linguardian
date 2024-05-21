import { Account, NextAuthOptions, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FaceBookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users.model";

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
          await connectMongoDB();
          const user = await User.findOne({ email });
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
    jwt({ token, user, account }) {
      if (user && account) {
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.id =
          account.provider === "credentials"
            ? user.id
            : account.provider + account.providerAccountId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
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
          await connectMongoDB();
          const idExists = await User.findOne({
            id: account?.provider + account?.providerAccountId,
          });
          if (!idExists) {
            if (!account) throw new Error("account is undefined");
            await User.create({
              id: account?.provider + account?.providerAccountId,
              username: profile?.name,
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
