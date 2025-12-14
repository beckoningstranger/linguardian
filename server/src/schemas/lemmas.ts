import { z } from "zod";

import { objectIdArraySchema } from "@/schemas/commonSchemas";
import { supportedLanguageSchema } from "@linguardian/shared/contracts";

export const lemmaSchema = z.object({
  name: z.string(),
  language: supportedLanguageSchema,
  items: objectIdArraySchema,
});

export type Lemma = z.infer<typeof lemmaSchema>;
