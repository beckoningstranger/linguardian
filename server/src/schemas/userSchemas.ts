import { z } from "zod";

import {
  emailSchema,
  LoginMethodSchema,
  objectIdStringSchema,
  oAuthProviders,
  passwordSchema,
  userSchema,
} from "@linguardian/shared/contracts";

export const oauthSchema = z
  .object(
    Object.fromEntries(
      oAuthProviders.map((provider) => [provider, z.string().optional()])
    )
  )
  .partial();

export const sensitiveUserSchema = userSchema.extend({
  email: emailSchema,
  password: passwordSchema.optional(),
  registeredVia: LoginMethodSchema,
  oauth: oauthSchema.optional(),
});

export const updateSensitiveUserSchema = sensitiveUserSchema
  .partial()
  .extend({ id: objectIdStringSchema });

/** ----------- Types ----------- */

export type SensitiveUser = z.infer<typeof sensitiveUserSchema>;
export type UpdateSensitiveUser = z.infer<typeof updateSensitiveUserSchema>;
export type Password = z.infer<typeof passwordSchema>;
