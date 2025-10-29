import {
  LearningMode,
  learningModeSchema,
  SupportedLanguage,
  supportedLanguageSchema,
} from "../contracts";
import { SearchParams } from "../types";

export function getSearchParam(
  key: string,
  searchParams: SearchParams
): string | undefined {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseLanguageCode(langCode: string): SupportedLanguage {
  const result = supportedLanguageSchema.safeParse(langCode);
  if (!result.success) throw new Error("Invalid language code");
  return result.data;
}

export function parseLearningMode(mode: string): LearningMode {
  const result = learningModeSchema.safeParse(mode);
  if (!result.success) throw new Error("Invalid learning mode");
  return result.data;
}

export function parseOverstudy(searchParams: SearchParams): boolean {
  const v = getSearchParam("overstudy", searchParams);
  if (v === undefined || v === "false") return false;
  if (v === "true") return true;
  throw new Error("Invalid overstudy param");
}

export function parseFrom(searchParams: SearchParams): "dashboard" | number {
  const v = getSearchParam("from", searchParams);
  if (v === undefined || v === "dashboard") return "dashboard";
  const n = Number(v);
  if (Number.isFinite(n)) return n;
  throw new Error("Invalid from param");
}

export function parseListNumber(s: string): number {
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error("Invalid list number");
  return n;
}

export function parseUnitNumber(s: string): number {
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error("Invalid unit number");
  return n;
}
