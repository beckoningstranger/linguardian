import { Types } from "mongoose";
import { z } from "zod";

import { Item, SupportedLanguage } from "./types";
import {
  allCases,
  allGenders,
  allPartsOfSpeech,
  allTags,
} from "./siteSettings";

export const tagSchema = z.enum(allTags);
export const genderSchema = z.enum(allGenders);
export const partOfSpeechSchema = z.enum(allPartsOfSpeech);
export const casesSchema = z.enum(allCases);

const emailSchema = z
  .string()
  .email()
  .min(7)
  .regex(
    ...createRegexWithMessage({
      nameOfString: "Email",
      numbers: true,
      characters: "-_.@",
    })
  );

const passwordSchema = z
  .string()
  .min(8, "Password should have at least 8 characters");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be 4-24 characters")
      .max(24, "Username must be 4-24 characters")
      .regex(
        ...createRegexWithMessage({
          nameOfString: "Username",
          numbers: true,
          characters: "-_",
        })
      ),
    email: emailSchema,
    password: passwordSchema.optional(),
    confirmPassword: passwordSchema.optional(),
    id: z.string(),
    image: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      return data.id.slice(0, 4) !== "cred" || data.password !== undefined;
    },
    { message: "You must enter a password", path: ["password"] }
  )
  .refine(
    (data) => {
      return (
        data.id.slice(0, 4) !== "cred" || data.confirmPassword !== undefined
      );
    },
    { message: "You must enter your password twice", path: ["confirmPassword"] }
  );

const ObjectIdSchema = z.custom<Types.ObjectId>(
  (value) => value instanceof Types.ObjectId,
  {
    message: "Invalid ObjectId",
  }
);

const itemSchemaWithoutTranslations = z.object({
  name: z.string().max(60, "Item names can be no longer than 60 characters"),
  normalizedName: z.string().max(60),
  language: z.custom<SupportedLanguage>(),
  languageName: z.string(),
  flagCode: z.string(),
  partOfSpeech: partOfSpeechSchema,
  lemmas: ObjectIdSchema.array().optional(),
  definition: z
    .string()
    .max(300, "Item definitions can be no longer than 250 characters")
    .optional(),
  gender: genderSchema.optional(),
  pluralForm: z
    .array(
      z.string().max(65, "Plural forms can be no longer than 65 characters")
    )
    .max(2, "There can be no more than 2 different plural forms")
    .optional(),
  slug: z.string().max(65),
  case: casesSchema.optional(),
  audio: z
    .array(
      z
        .string()
        .max(80, "URLs to audio files can be no longer than 80 characters")
    )
    .optional(),
  pics: z
    .array(
      z
        .string()
        .max(80, "URLs to image files can be no longer than 80 characters")
    )
    .optional(),
  vids: z
    .array(
      z
        .string()
        .max(80, "URLs to video files can be no longer than 80 characters")
    )
    .optional(),
  IPA: z
    .array(
      z
        .string()
        .max(50, "IPA transcriptions can be no longer than 50 characters")
    )
    .optional(),
  tags: tagSchema
    .array()
    .max(5, "Each item can receive a maximum of 5 tags")
    .optional(),
  context: z
    .array(
      z.object({
        text: z
          .string()
          .max(150, "Context items can be no longer than 150 characters"),
        author: z.string(),
        takenFrom: z
          .string()
          .max(50, "Make it 50 characters or shorter")
          .optional(),
      })
    )
    .optional(),
  relevance: ObjectIdSchema.optional(),
  collocations: ObjectIdSchema.optional(),
});
// .refine(
//   (data: ItemSchema): data is ItemSchema => {
//     const langFeatures = siteSettings.languageFeatures.find(
//       (lang) => lang.langCode === data.language
//     );

//     const additionalCharacters = "";
//     const languageSpecificCharacters =
//       langFeatures?.requiresHelperKeys.join("") || "";

//     const [regex] = createRegexWithMessage({
//       characters: (languageSpecificCharacters || "") + additionalCharacters,
//     });

//     // Assuming we're sure definition (as an example) is an array of strings
//     return data.definition?.every((string) => regex.test(string)) ?? false;
//   },
//   {
//     message: "BOOM",
//     path: ["definition"],
//   }
// );

const parsedItemSpecificSchema = z.object({
  translations: z
    .custom<Partial<Record<SupportedLanguage, string[]>>>()
    .optional(),
  unit: z
    .string()
    .max(50, "Unit names cannot be longer than 50 characters")
    .optional(),
});

export const parsedItemSchema = itemSchemaWithoutTranslations.merge(
  parsedItemSpecificSchema
);

const translationsSchema = z.object({
  translations: z
    .custom<Partial<Record<SupportedLanguage, Types.ObjectId[]>>>()
    .optional(),
});
const populatedTranslationsSchema = z.object({
  translations: z.custom<Partial<Record<SupportedLanguage, Item[]>>>(),
});

export const itemSchemaWithTranslations =
  itemSchemaWithoutTranslations.merge(translationsSchema);
export const itemSchemaWithPopulatedTranslations =
  itemSchemaWithoutTranslations.merge(populatedTranslationsSchema);

function createRegexWithMessage({
  nameOfString = "String",
  letters = true,
  numbers = false,
  characters,
}: {
  nameOfString?: string;
  letters?: boolean;
  numbers?: boolean;
  characters: string;
}): [RegExp, string] {
  // Escape special characters in the provided characters
  const escapedCharacters = characters.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

  // Construct regex, ensuring '-' is at the end of the character class if needed
  const regex = new RegExp(
    `^[${letters ? "a-zA-Z" : ""}${numbers ? "0-9" : ""}${escapedCharacters}]+$`
  );

  // Create the validation message
  const message = `${nameOfString} may only contain ${
    letters ? "letters" : ""
  }${letters && numbers ? ", " : ""}${numbers ? "numbers" : ""}${
    (letters || numbers) && characters ? " and " : ""
  }${characters ? `these characters: ${characters}` : ""}`.trim();

  return [regex, message];
}
