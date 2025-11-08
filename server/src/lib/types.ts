import { Request } from "express";
import { ParsedQs } from "qs";
import { z, ZodSchema } from "zod";

import {
  AuthTokenPayload,
  LearningMode,
  SupportedLanguage,
} from "@/lib/contracts";

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
