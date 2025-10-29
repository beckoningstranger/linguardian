import {
  AuthTokenPayload,
  FullyPopulatedList,
  LearningMode,
  PopulatedList,
  SupportedLanguage,
} from "@/lib/contracts";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
      listNumber?: number;
      unitNumber?: number;
      itemId?: string;
      learningMode?: LearningMode;
      overstudy?: boolean;
      langCode?: SupportedLanguage;
    }
  }
}
