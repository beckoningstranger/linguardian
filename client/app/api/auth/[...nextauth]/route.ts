import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users.model";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FaceBookProvider from "next-auth/providers/facebook";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const FACEBOOK_ID = process.env.FACEBOOK_ID;
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;

if (!GOOGLE_ID || !GOOGLE_SECRET || !FACEBOOK_ID || !FACEBOOK_SECRET)
  throw new Error("Error getting environment variables");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
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
    jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectMongoDB();
        const idExists = await User.findOne({ id: profile?.sub });
        if (!idExists) {
          await User.create({
            id: profile?.sub,
            username: profile?.name,
            email: profile?.email,
            image: profile?.picture,
          });
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
