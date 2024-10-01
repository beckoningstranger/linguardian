import { Types } from "mongoose";
import { z } from "zod";
import { Item, SupportedLanguage } from "./types.js";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, "Your username must be between 4 and 24 characters long")
      .max(24, "Your username must be between 4 and 24 characters long"),
    email: z.string().email().min(7),
    password: z
      .string()
      .min(8, "Your password should have at least 8 characters")
      .optional(),
    confirmPassword: z.string().optional(),
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

const itemSchemaWithoutTranslations = z.object({
  _id: z.custom<Types.ObjectId>(),
  name: z.string().max(60, "Item names can be no longer than 60 characters"),
  normalizedName: z.string().max(30),
  language: z.custom<SupportedLanguage>(),
  partOfSpeech: z.enum([
    "noun",
    "pronoun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
    "conjunction",
    "determiner",
    "interjection",
    "particle",
    "phrase",
  ]),
  lemmas: z.custom<Types.ObjectId>().optional(),
  definition: z
    .string()
    .max(300, "Item definitions can be no longer than 300 characters")
    .array()
    .optional(),
  gender: z
    .enum(["masculine", "feminine", "neuter", "common", "animate", "inanimate"])
    .optional(),
  pluralForm: z
    .string()
    .max(35, "Plural forms can be no longer than 35 characters")
    .array()
    .max(2, "There can be no more than 2 different plural forms")
    .optional(),
  slug: z.string().max(60),
  case: z
    .enum([
      "nominative",
      "genitive",
      "dative",
      "accusative",
      "instrumental",
      "locative",
      "vocative",
      "accusative & dative",
    ])
    .optional(),
  audio: z
    .string()
    .max(80, "URLs to audio files can be no longer than 80 characters")
    .array()
    .optional(),
  pics: z
    .string()
    .max(80, "URLs to pictures can be no longer than 80 characters")
    .array()
    .optional(),
  vids: z
    .string()
    .max(80, "URLs to videos can be no longer than 80 characters")
    .array()
    .optional(),
  IPA: z
    .string()
    .max(50, "IPA transcriptions can be no longer than 50 characters")
    .array()
    .optional(),
  tags: z
    .enum([
      "archaic",
      "obsolete",
      "vulgar",
      "slang",
      "humorous",
      "literary",
      "transitive",
      "intransitive",
      "colloquial",
      "Belgian French",
    ])
    .array()
    .max(5, "Each item can receive a maximum of 5 tags")
    .optional(),
  relevance: z.custom<Types.ObjectId>().optional(),
  collocations: z.custom<Types.ObjectId>().optional(),
});

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
