import { z } from "zod";

import { supportedLanguageSchema } from "@/lib/contracts/common";
import { listForDashboardSchema } from "@/lib/contracts/lists";

/** ----------- Dashboard ----------- */
export const dashboardDataParamsSchema = z.object({
  language: supportedLanguageSchema,
});

export const dashboardDataSchema = z.object({
  listsForDashboard: z.array(listForDashboardSchema),
});

/** ----------- Types ----------- */
export type DashboardDataParams = z.infer<typeof dashboardDataParamsSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
