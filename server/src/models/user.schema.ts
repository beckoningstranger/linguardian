import { model, Schema } from "mongoose";

import { oAuthProviders, SupportedLanguage } from "@/lib/contracts";
import { SensitiveUser } from "@/lib/schemas";
import { allSupportedLanguages } from "@/lib/siteSettings";
import { mongooseLanguageWithFlagAndNameSchema } from "./helperSchemas";

const mongooseUserSchema = new Schema<SensitiveUser>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    usernameSlug: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    completedOnboarding: { type: Boolean, required: true },
    native: {
      type: mongooseLanguageWithFlagAndNameSchema,
      _id: false,
    },
    registeredVia: { type: String },
    oauth: {
      type: Object,
      default: {},
      validate: {
        validator: (value: Record<string, string>) => {
          if (!value || typeof value !== "object") return false;
          return Object.keys(value).every((key) =>
            oAuthProviders.includes(key as (typeof oAuthProviders)[number])
          );
        },
        message: (props: any) =>
          `Invalid OAuth provider keys: ${Object.keys(props.value)
            .filter((key) => !oAuthProviders.includes(key as any))
            .join(", ")}`,
      },
    },
    learnedLanguages: {
      type: [mongooseLanguageWithFlagAndNameSchema],
      default: [],
      _id: false,
    },
    learnedLists: {
      type: Object,
      required: true,
      validate: {
        validator: (value: any) => {
          return Object.keys(value).every((key) =>
            allSupportedLanguages.includes(key as SupportedLanguage)
          );
        },
        message: (props) =>
          `${
            props.value
          } contains invalid keys. Allowed are: ${allSupportedLanguages.join(
            ", "
          )}`,
      },
      default: {},
    },
    learnedItems: {
      type: Object,
      required: true,
      validate: {
        validator: (value: Record<string, any>) => {
          const validKeys = Object.keys(value).every((key) =>
            allSupportedLanguages.includes(key as SupportedLanguage)
          );

          const validValues = Object.values(value).every(
            (arr) =>
              Array.isArray(arr) && arr.every((num) => typeof num === "number")
          );

          return validKeys && validValues;
        },
        message: (props: { value: Record<string, any> }) => {
          const invalidKeys = Object.keys(props.value).filter(
            (key) => !allSupportedLanguages.includes(key as SupportedLanguage)
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
      required: true,
      validate: {
        validator: (value: any) => {
          return Object.keys(value).every((key) =>
            allSupportedLanguages.includes(key as SupportedLanguage)
          );
        },
        message: (props) =>
          `${
            props.value
          } contains invalid language keys. Allowed keys are: ${allSupportedLanguages.join(
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
            allSupportedLanguages.includes(key as SupportedLanguage)
          );
        },
        message: (props) =>
          `${
            props.value
          } contains invalid language keys. Allowed keys are: ${allSupportedLanguages.join(
            ", "
          )}`,
      },
      default: {},
    },
    recentDictionarySearches: {
      type: [Object],
      default: [],
    },
    activeLanguageAndFlag: {
      type: mongooseLanguageWithFlagAndNameSchema,
      _id: false,
    },
    roles: { type: [String] },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

export const UserModel = model<SensitiveUser>("User", mongooseUserSchema);
