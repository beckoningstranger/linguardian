import { z } from "zod";

import { supportedLanguageSchema } from "../contracts/common";
import {
  learningModeWithInfoSchema,
  listForDashboardSchema,
} from "../contracts/lists";

/** ----------- Dashboard ----------- */
export const dashboardDataParamsSchema = z.object({
  language: supportedLanguageSchema,
});

export const dashboardDataSchema = z.object({
  listsForDashboard: z.array(listForDashboardSchema),
  modesAvailableForAllLists: z.array(learningModeWithInfoSchema),
});

/** ----------- Types ----------- */
export type DashboardDataParams = z.infer<typeof dashboardDataParamsSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
