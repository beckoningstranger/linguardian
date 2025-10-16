import {
  AuthTokenPayload,
  FullyPopulatedList,
  LearningMode,
  PopulatedList,
} from "@/lib/contracts";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
      listNumber?: number;
      unitNumber?: number;
      itemId?: string;
      learningMode?: LearningMode;
    }
  }
}
