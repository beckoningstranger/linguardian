import { z } from "zod";

import {
  allCases,
  allGenders,
  allPartsOfSpeech,
  allTags,
  supportedLanguageCodes,
} from "./siteSettings";
import { Types } from "mongoose";

export const supportedLanguageSchema = z.enum(supportedLanguageCodes);
export const tagSchema = z.enum(allTags);
export const genderSchema = z.preprocess(
  (val) => (val === "" || val == null ? undefined : val),
  z.enum(allGenders, {
    errorMap: () => ({ message: "Please select a noun gender" }),
  })
);
export const partOfSpeechSchema = z.preprocess(
  (val) => (val === "" || val == null ? undefined : val),
  z.enum(allPartsOfSpeech, {
    errorMap: () => ({ message: "Please select a part of speech" }),
  })
);
export const casesSchema = z.preprocess(
  (val) => (val === "" || val == null ? undefined : val),
  z.enum(allCases, {
    errorMap: () => ({
      message: "Please select the case that follows this preposition",
    }),
  })
);

const singleWordRegex = /^[\p{L}]+$/u;
const sentenceRegex = /^[\p{L}\s!?¿()':.,-]+$/u;
const sentenceRegexMessage =
  "Only letters, spaces, and basic punctuation (!?¿()':.,-) are allowed";
const ipaRegex = /^[\p{L}\p{M}\p{S}ˈˌː‿\s]+$/u;

export const emailSchema = z
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
    {
      message: "You must enter your password twice",
      path: ["confirmPassword"],
    }
  );

export const objectIdSchema = z.custom<Types.ObjectId>(
  (value) => value instanceof Types.ObjectId,
  {
    message: "Invalid ObjectId",
  }
);

const itemSchemaWithoutTranslations = z.object({
  _id: objectIdSchema,
  name: z
    .string()
    .nonempty("Please enter an item name")
    .regex(sentenceRegex, sentenceRegexMessage)
    .max(60, "Item names can be no longer than 60 characters"),
  normalizedName: z.string().max(60),
  language: supportedLanguageSchema,
  languageName: z.string(),
  flagCode: z.string(),
  partOfSpeech: partOfSpeechSchema,
  lemmas: objectIdSchema.array().optional(),
  definition: z
    .string()
    .regex(sentenceRegex, sentenceRegexMessage)
    .max(300, "Item definitions can be no longer than 250 characters")
    .optional()
    .refine((val) => val === undefined || val.length >= 25, {
      message: "Item definitions should be at least 25 characters long",
    }),
  gender: genderSchema.optional(),
  pluralForm: z
    .array(
      z
        .string()
        .max(65, "Plural forms can be no longer than 65 characters")
        .regex(sentenceRegex, sentenceRegexMessage)
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
        .regex(ipaRegex, "Only valid IPA characters and spaces are allowed.")
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
          .regex(sentenceRegex, sentenceRegexMessage + " for context items")
          .min(25, "Context items should be at least 25 characters long")
          .max(150, "Context items can be no longer than 150 characters"),
        author: z.string(),
        takenFrom: z
          .string()
          .regex(
            new RegExp(
              sentenceRegex.source.replace("+", "*"),
              sentenceRegex.flags
            ), // allow empty string
            sentenceRegexMessage + " for context sources"
          )
          .max(50, "If you provide a source, make it 50 characters or shorter")
          .optional(),
      })
    )
    .optional(),
});

export const parsedItemSpecificSchema = z.object({
  translations: z
    .record(supportedLanguageSchema, z.array(z.string()))
    .optional(),
  unit: z
    .string()
    .max(50, "Unit names cannot be longer than 50 characters")
    .optional(),
});

export const parsedItemSchema = itemSchemaWithoutTranslations
  .merge(parsedItemSpecificSchema)
  .omit({ _id: true });

export const translationsSchema = z.object({
  translations: z
    .record(supportedLanguageSchema, z.array(objectIdSchema))
    .optional(),
});

export const translationsSchemaFE = z.object({
  translations: z
    .record(supportedLanguageSchema, z.array(z.string()))
    .optional(),
});

export const populatedTranslationsSchema = z.object({
  translations: z.record(
    supportedLanguageSchema,
    z.array(itemSchemaWithoutTranslations)
  ),
});

export const populatedTranslationsSchemaFE = z.object({
  translations: z.record(
    supportedLanguageSchema,
    z.array(
      itemSchemaWithoutTranslations
        .omit({ _id: true, lemmas: true })
        .extend({ _id: z.string(), lemmas: z.array(z.string()) })
    )
  ),
});

export const itemSchemaWithTranslations =
  itemSchemaWithoutTranslations.merge(translationsSchema);

export const itemSchemaWithTranslationsFE = itemSchemaWithoutTranslations
  .omit({ _id: true, lemmas: true })
  .extend({ _id: z.string(), lemmas: z.array(z.string()) })
  .merge(
    z.object({
      translations: z
        .record(supportedLanguageSchema, z.array(z.string()))
        .optional(),
    })
  );

export const itemSchemaWithPopulatedTranslations =
  itemSchemaWithoutTranslations.merge(populatedTranslationsSchema);

export const itemSchemaWithPopulatedTranslationsFE =
  itemSchemaWithoutTranslations
    .omit({ _id: true, lemmas: true })
    .extend({ _id: z.string(), lemmas: z.array(z.string()) })
    .merge(populatedTranslationsSchemaFE);

export const languageWithFlagAndNameSchema = z.object({
  code: supportedLanguageSchema,
  flag: z.string(),
  name: z.string(),
});

export const learnedItemSchema = z.object({
  id: z.string(),
  level: z.number(),
  nextReview: z.number(),
});

export const SRSettingsSchema = z.object({
  reviewTimes: z.object({
    1: z.number(),
    2: z.number(),
    3: z.number(),
    4: z.number(),
    5: z.number(),
    6: z.number(),
    7: z.number(),
    8: z.number(),
    9: z.number(),
    10: z.number(),
  }),
  itemsPerSession: z.object({
    learning: z.number(),
    reviewing: z.number(),
  }),
});

export const recentDictionarySearchesSchema = z.object({
  itemId: objectIdSchema,
  dateSearched: z.date(),
});

export const learnedListsSchema = z.record(
  supportedLanguageSchema,
  z.array(z.number())
);

export const learnedItemsSchema = z.record(
  supportedLanguageSchema,
  z.array(learnedItemSchema)
);

export const ignoredItemsSchema = z.record(
  supportedLanguageSchema,
  z.array(objectIdSchema)
);

export const customSRSettingsSchema = z.record(
  supportedLanguageSchema,
  SRSettingsSchema
);

export const IPASchema = z.object({
  help: z.string(),
  consonants: z.array(z.string()),
  vowels: z.array(z.string()),
  rare: z.array(z.string()).optional(),
  helperSymbols: z.array(z.string()),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  usernameSlug: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  image: z.string(),
  native: languageWithFlagAndNameSchema,
  learnedLanguages: z.array(languageWithFlagAndNameSchema),
  learnedLists: learnedListsSchema,
  learnedItems: learnedItemsSchema,
  ignoredItems: ignoredItemsSchema,
  customSRSettings: customSRSettingsSchema,
  recentDictionarySearches: z.array(recentDictionarySearchesSchema),
  activeLanguageAndFlag: languageWithFlagAndNameSchema.optional(),
});

export const sortedTagsSchema = z
  .object({
    forAll: z.array(tagSchema),
  })
  .catchall(z.array(tagSchema));

export const languageFeaturesSchema = z.object({
  langName: z.string(),
  langCode: supportedLanguageSchema,
  flagCode: z.string(),
  requiresHelperKeys: z.array(z.string()),
  hasGender: z.array(genderSchema),
  hasCases: z.array(casesSchema),
  hasRomanization: z.boolean(),
  hasTones: z.boolean(),
  ipa: IPASchema,
  partsOfSpeech: z.array(partOfSpeechSchema).readonly(),
  tags: sortedTagsSchema,
});

// HELPER FUNCTIONS - Should be moved probably, but then the file it moves to must be available on frontend also

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
// const itemSchemaWithPopulatedTranslations = itemSchemaWithoutTranslations.merge(
//   populatedTranslationsSchema
// );

// const itemSchemaWithTranslationsFrontend = itemSchemaWithTranslations.omit({
//   _id: true,
//   lemmas: true,
// });
