import { model, Schema } from "mongoose";
import { siteSettings } from "../lib/siteSettings.js";
import { SupportedLanguage, User } from "../lib/types.js";
import { languageWithFlagAndNameSchema } from "./helperSchemas";

const supportedLanguages = siteSettings.supportedLanguages;
const userSchema = new Schema<User>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    usernameSlug: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    image: { type: String, required: false },
    native: {
      type: languageWithFlagAndNameSchema,
    },
    learnedLanguages: {
      type: [languageWithFlagAndNameSchema],
      default: [],
    },
    learnedLists: {
      type: Object,
      validate: {
        validator: (value: any) => {
          return Object.keys(value).every((key) =>
            supportedLanguages.includes(key as SupportedLanguage)
          );
        },
        message: (props) =>
          `${
            props.value
          } contains invalid keys. Allowed are: ${supportedLanguages.join(
            ", "
          )}`,
      },
      default: {},
    },
    learnedItems: {
      type: Object,
      validate: {
        validator: (value: Record<string, any>) => {
          const validKeys = Object.keys(value).every((key) =>
            supportedLanguages.includes(key as SupportedLanguage)
          );

          const validValues = Object.values(value).every(
            (arr) =>
              Array.isArray(arr) && arr.every((num) => typeof num === "number")
          );

          return validKeys && validValues;
        },
        message: (props: { value: Record<string, any> }) => {
          const invalidKeys = Object.keys(props.value).filter(
            (key) => !supportedLanguages.includes(key as SupportedLanguage)
          );
          const invalidValues = Object.entries(props.value).filter(
            ([_, arr]) =>
              !Array.isArray(arr) || arr.some((num) => typeof num !== "number")
          );
          return `Invalid keys : ${invalidKeys.join(
            ", "
          )}, Invalid values: ${invalidValues.map(([key]) => key).join(", ")}`;
        },
      },
      default: {},
    },
    ignoredItems: {
      type: Object,
      validate: {
        validator: (value: any) => {
          return Object.keys(value).every((key) =>
            supportedLanguages.includes(key as SupportedLanguage)
          );
        },
        message: (props) =>
          `${
            props.value
          } contains invalid language keys. Allowed keys are: ${supportedLanguages.join(
            ", "
          )}`,
      },
      default: {},
    },
    customSRSettings: {
      type: Object,
      validate: {
        validator: (value: any) => {
          return Object.keys(value).every((key) =>
            supportedLanguages.includes(key as SupportedLanguage)
          );
        },
        message: (props) =>
          `${
            props.value
          } contains invalid language keys. Allowed keys are: ${supportedLanguages.join(
            ", "
          )}`,
      },
      default: {},
    },
    recentDictionarySearches: {
      type: [Object],
      required: true,
      default: [],
    },
    activeLanguageAndFlag: {
      type: languageWithFlagAndNameSchema,
      required: false,
    },
  },
  { timestamps: true }
);

export default model<User>("User", userSchema);
