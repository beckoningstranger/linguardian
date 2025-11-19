import { Request } from "express";
import { ParsedQs } from "qs";
import { z, ZodSchema } from "zod";

import {
  AuthTokenPayload,
  LearningMode,
  ParseResult,
  SupportedLanguage,
} from "@/lib/contracts";
import { ParsedItem } from "@/lib/schemas";
import { Types } from "mongoose";

/** ------------------------- Parsing CSV Files -------------------------*/

export type ParsedCSVRow = {
  rowNumber: number;
  item: ParsedItem;
  rawName: string | undefined;
};

export type CSVParseResult = {
  rows: ParsedCSVRow[];
  results: ParseResult[];
};

export type ExistingItemInfo = {
  _id: Types.ObjectId;
  name: string;
  language: SupportedLanguage;
  partOfSpeech: string;
};

export type UnitToAdd = {
  unitName: string;
  itemId: Types.ObjectId;
  rowNumber: number;
  name: string;
};

export type ImportPlan = {
  existingUnitsToAdd: UnitToAdd[];
  newItems: ParsedCSVRow[];
  results: ParseResult[];
};

/** ------------------------- Miscellaneous -------------------------*/

export type HandlerOptions<TParams, TData> = {
  parseParams: z.ZodSchema<TParams>;
  service: (params: TParams) => Promise<TData>;
  validateOutput: z.ZodSchema<TData>;
};

export type HandlerOptionsAuthenticatedRequest<TParams, TData> = {
  parseParams: z.ZodSchema<TParams>;
  service: (params: TParams, id: string) => Promise<TData>;
  validateOutput: z.ZodSchema<TData>;
};

export type SafeDbReadOptions<T> = {
  dbReadQuery: () => Promise<unknown>;
  removeObjectIds?: boolean;
  schemaForValidation: ZodSchema<T>;
  errorMessage?: string;
};

export type SafeDbWriteOptions<S extends z.ZodTypeAny, T> = {
  input: unknown;
  schemaForValidation: S;
  dbWriteQuery: (validated: z.infer<S>) => Promise<T>;
  errorMessage?: string;
};

export type AuthenticatedRequest<
  P = Record<string, any>, // route params
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  auth: AuthTokenPayload;
};

export type AuthenticatedExpandListRequest<
  P = Record<string, any>, // route params
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  auth: AuthTokenPayload;
  listNumber: number;
  fileName: string;
};

export type AuthenticatedListRequest<
  P = Record<string, any>, // route params
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  auth: AuthTokenPayload;
  listNumber: number;
};

export type AuthenticatedItemRequest<
  P = Record<string, any>, // route params
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  auth: AuthTokenPayload;
  itemId: string;
};

export type AuthenticatedLearningSessionRequestForList<
  P = Record<string, any>, // route params
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  auth: AuthTokenPayload;
  learningMode: LearningMode;
  listNumber: number;
  overstudy: boolean;
};

export type AuthenticatedLearningSessionRequestForUnit<
  P = Record<string, any>, // route params
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  auth: AuthTokenPayload;
  learningMode: LearningMode;
  listNumber: number;
  unitNumber: number;
  overstudy: boolean;
};

export type AuthenticatedLearningSessionRequestForLanguage<
  P = Record<string, any>, // route params
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  auth: AuthTokenPayload;
  learningMode: LearningMode;
  langCode: SupportedLanguage;
  overstudy: boolean;
};
