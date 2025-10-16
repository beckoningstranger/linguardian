import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import { ObjectId, SensitiveUser } from "@/lib/schemas";
import { defaultSRSettings } from "@/lib/siteSettings";
import {
  RegistrationData,
  User,
  userSchema,
  userSchemaWithEmail,
} from "../contracts";
import { generateUniqueUsernameSlug } from "./shared";

export async function buildNewUser(
  registrationData: RegistrationData
): Promise<SensitiveUser & { _id: ObjectId }> {
  const { confirmPassword, ...dataWithoutConfirmPassword } = registrationData;

  const _id = new Types.ObjectId();
  const baseUser: SensitiveUser & { _id: ObjectId } = {
    _id,
    id: _id.toHexString(),
    username: "",
    usernameSlug: "",
    email: "",
    image: "",
    native: { code: "EN", flag: "EN", name: "English" },
    registeredVia: "email",
    learnedLanguages: [],
    learnedLists: { EN: [] },
    learnedItems: { EN: [] },
    ignoredItems: { EN: [] },
    customSRSettings: { EN: defaultSRSettings },
    recentDictionarySearches: [],
    activeLanguageAndFlag: { code: "EN", flag: "EN", name: "English" },
    completedOnboarding: false,
    roles: ["learner"],
  };

  const newUser: SensitiveUser & { _id: ObjectId } = {
    ...baseUser,
    ...dataWithoutConfirmPassword,
    oauth: registrationData.oauthId
      ? { [registrationData.registeredVia]: registrationData.oauthId }
      : {},
    usernameSlug: await generateUniqueUsernameSlug(registrationData.username),
    registeredVia: registrationData.registeredVia,
    password: registrationData.password
      ? await bcrypt.hash(registrationData.password, 10)
      : undefined,
  };

  return newUser;
}

export function sanitizeUser(sensitiveUser: SensitiveUser): User {
  const { password, oauth, email, registeredVia, ...rest } = sensitiveUser;

  const result = userSchema.safeParse(rest);
  if (!result.success) throw Error("Sanitizing user failed!");
  return result.data;
}

export function sanitizeUserKeepEmail(sensitiveUser: SensitiveUser): User {
  const { password, oauth, registeredVia, ...rest } = sensitiveUser;

  const result = userSchemaWithEmail.safeParse(rest);
  if (!result.success) throw Error("Sanitizing user with email failed!");
  return result.data;
}
