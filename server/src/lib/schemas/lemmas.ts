import { z } from "zod";

import { objectIdArraySchema } from "@/lib/schemas/commonSchemas";
import { supportedLanguageSchema } from "@/lib/contracts";

export const lemmaSchema = z.object({
  name: z.string(),
  language: supportedLanguageSchema,
  items: objectIdArraySchema,
});

export type Lemma = z.infer<typeof lemmaSchema>;
