import { EncryptJWT } from "jose";
import type { Session } from "next-auth";
import { Account, NextAuthOptions } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { createUser, loginUser } from "@/lib/api/user-api";
import {
    OAuthProviderSchema,
    OAuthProvider,
    oAuthProviders,
    SessionUser,
} from "@linguardian/shared/contracts";
import { randomUUID } from "crypto";

// Environment variables will be validated when providers are actually used

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
        // Environment values are enforced on the server; placeholders are safe on the client bundle.
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "placeholder",
            clientSecret: process.env.GOOGLE_SECRET || "placeholder",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "placeholder",
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
                const secret = process.env.NEXTAUTH_SECRET;
                if (!secret) {
                    console.error(
                        "[auth] JWT: Missing NEXTAUTH_SECRET environment variable"
                    );
                    return token;
                }
                const secretBuffer = Buffer.from(secret, "base64");
                const accessToken = await new EncryptJWT({ id: token.id })
                    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
                    .setIssuedAt()
                    .setExpirationTime("7d")
                    .setJti(randomUUID())
                    .encrypt(secretBuffer);

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
                // Validate environment variables are available for OAuth providers
                if (account.provider === "google") {
                    if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
                        console.error(
                            "[auth] signIn: Missing Google OAuth environment variables"
                        );
                        return false;
                    }
                }

                const parsedProvider = OAuthProviderSchema.safeParse(
                    account.provider
                );
                if (!parsedProvider.success) {
                    console.error(
                        "[auth] signIn: Invalid OAuth provider",
                        account.provider
                    );
                    return false;
                }

                if (!account.providerAccountId) {
                    console.error("[auth] signIn: Missing providerAccountId", {
                        account,
                    });
                    return false;
                }

                try {
                    const response = await loginUser({
                        method: parsedProvider.data,
                        id: account.providerAccountId,
                    });
                    if (response.success) {
                        return true;
                    }
                    console.log("[auth] signIn: loginUser failed", {
                        provider: account.provider,
                        error: response.error,
                    });
                } catch (error) {
                    console.error(
                        "[auth] signIn: loginUser threw error",
                        error
                    );
                }

                if (profile && profile.name && profile.email) {
                    try {
                        const created = await createUser({
                            oauthId: account.providerAccountId,
                            username:
                                profile.name.length > 4
                                    ? profile.name.replace(/\s/g, "")
                                    : (
                                          profile.name + "LearnsLanguages"
                                      ).replace(/\s/g, ""),
                            email: profile.email,
                            registeredVia: parsedProvider.data,
                            image: profile.picture,
                        });

                        if (created.success) {
                            return true;
                        }
                        console.log("[auth] signIn: createUser failed", {
                            provider: account.provider,
                            error: created.error,
                        });
                    } catch (error) {
                        console.error(
                            "[auth] signIn: createUser threw error",
                            error
                        );
                    }
                } else {
                    console.error("[auth] signIn: Missing profile data", {
                        profile,
                    });
                }
            } else {
                console.error("[auth] signIn: Missing account or provider", {
                    account,
                });
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
