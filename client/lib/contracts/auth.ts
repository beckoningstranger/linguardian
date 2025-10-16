import { z } from "zod";

import { emailSchema, passwordSchema } from "@/lib/contracts/common";
import { usernameSchema } from "@/lib/contracts/users";

export const oAuthProviders = ["google"] as const;
export const OAuthProviderSchema = z.enum(oAuthProviders);
export const LoginMethodSchema = z.enum([...oAuthProviders, "email"]);

export const signinWithEmailSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registrationDataSchema = z
  .object({
    oauthId: z.string().optional(),
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema.optional(),
    confirmPassword: z.string().optional(),
    registeredVia: LoginMethodSchema,
    image: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      return (
        data.registeredVia.slice(0, 5) !== "email" ||
        data.password !== undefined
      );
    },
    { message: "You must enter a password", path: ["password"] }
  )
  .refine(
    (data) => {
      return (
        data.registeredVia.slice(0, 4) !== "email" ||
        data.confirmPassword !== undefined
      );
    },
    {
      message: "You must enter your password twice",
      path: ["confirmPassword"],
    }
  );

export const loginUserParamsSchema = z.object({
  method: LoginMethodSchema,
  id: z.string(),
  password: passwordSchema.optional(),
});

/** This is closely linked to sessionUserSchema in ./users.ts
 * but we'll keep it seperate for security reasons */
export const jwtPayLoadSchema = z.object({
  id: z.string().min(1),
});

/** ----------- Types ----------- */
export type SignInWithEmailSchema = z.infer<typeof signinWithEmailSchema>;
export type AuthTokenPayload = z.infer<typeof jwtPayLoadSchema>;
export type RegistrationData = z.infer<typeof registrationDataSchema>;
export type LoginUserParams = z.infer<typeof loginUserParamsSchema>;
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;
export type LoginMethod = z.infer<typeof LoginMethodSchema>;

/** ----------- Additional Types that are not inferred----------- */
export type FetchUserMethods = LoginMethod | "usernameSlug" | "_id";
export type ResolveUserIdParams =
  | { email: string }
  | { usernameSlug: string }
  | { oauth: { provider: OAuthProvider; id: string } };
export type GetUserParams = {
  method: FetchUserMethods;
  query: string;
};
