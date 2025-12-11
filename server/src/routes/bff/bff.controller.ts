import { Request, Response } from "express";
import logger from "@/lib/logger";

import {
  dashboardDataParamsSchema,
  dashboardDataSchema,
  editListPageDataParamsSchema,
  editListPageDataSchema,
  editUnitDataSchema,
  learningSessionDataSchema,
  listOverviewDataParamsSchema,
  listOverviewDataSchema,
  listStoreDataParamsSchema,
  listStoreDataSchema,
  unitDataParamsSchema,
  unitOverviewDataSchema,
} from "@/lib/contracts";
import { DashboardDataService } from "@/lib/services/dashboard";
import { ListStoreDataService } from "@/lib/services/list-store";
import {
  EditListPageDataService,
  ListOverviewDataService,
} from "@/lib/services/lists";
import {
  EditUnitDataService,
  UnitOverviewDataService,
} from "@/lib/services/units";
import {
  AuthenticatedLearningSessionRequestForLanguage,
  AuthenticatedLearningSessionRequestForList,
  AuthenticatedLearningSessionRequestForUnit,
} from "@/lib/types";
import {
  createAuthenticatedRequestHandler,
  createUnauthenticatedRequestHandler,
  errorResponse,
  formatZodErrors,
  successResponse,
} from "@/lib/utils";
import {
  LearningSessionDataServiceForLanguage,
  LearningSessionDataServiceForListOrUnit,
} from "@/lib/services/learning";

export const getDashboardDataController = createAuthenticatedRequestHandler({
  parseParams: dashboardDataParamsSchema,
  service: DashboardDataService,
  validateOutput: dashboardDataSchema,
});

export const getListOverviewDataController = createAuthenticatedRequestHandler({
  parseParams: listOverviewDataParamsSchema,
  service: ListOverviewDataService,
  validateOutput: listOverviewDataSchema,
});

export const getListStoreDataController = createUnauthenticatedRequestHandler({
  parseParams: listStoreDataParamsSchema,
  service: ListStoreDataService,
  validateOutput: listStoreDataSchema,
});

export const getEditListDataController = createAuthenticatedRequestHandler({
  parseParams: editListPageDataParamsSchema,
  service: EditListPageDataService,
  validateOutput: editListPageDataSchema,
});

export const getUnitOverviewDataController = createAuthenticatedRequestHandler({
  parseParams: unitDataParamsSchema,
  service: UnitOverviewDataService,
  validateOutput: unitOverviewDataSchema,
});

export const getEditUnitDataController = createAuthenticatedRequestHandler({
  parseParams: unitDataParamsSchema,
  service: EditUnitDataService,
  validateOutput: editUnitDataSchema,
});

export async function getLearningSessionForListDataController(
  req: AuthenticatedLearningSessionRequestForList,
  res: Response
) {
  const listNumber = req.listNumber;
  const userId = req.auth.id;
  const learningMode = req.learningMode;
  const overstudy = req.overstudy;

  try {
    const response = await LearningSessionDataServiceForListOrUnit({
      listNumber,
      userId,
      mode: learningMode,
      overstudy,
    });

    const result = learningSessionDataSchema.safeParse(response);
    if (!result.success)
      return errorResponse(res, 500, formatZodErrors(result.error));

    return successResponse(res, 200, result.data);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function getLearningSessionForUnitDataController(
  req: AuthenticatedLearningSessionRequestForUnit,
  res: Response
) {
  const listNumber = req.listNumber;
  const unitNumber = req.unitNumber;
  const userId = req.auth.id;
  const learningMode = req.learningMode;
  const overstudy = req.overstudy;

  try {
    const response = await LearningSessionDataServiceForListOrUnit({
      listNumber,
      userId,
      mode: learningMode,
      unitNumber,
      overstudy,
    });

    const result = learningSessionDataSchema.safeParse(response);
    if (!result.success)
      return errorResponse(res, 500, formatZodErrors(result.error));

    return successResponse(res, 200, result.data);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

export async function getLearningSessionForLanguageDataController(
  req: AuthenticatedLearningSessionRequestForLanguage,
  res: Response
) {
  const langCode = req.langCode;
  const userId = req.auth.id;
  const learningMode = req.learningMode;
  const overstudy = req.overstudy;

  try {
    const response = await LearningSessionDataServiceForLanguage({
      userId,
      mode: learningMode,
      overstudy,
      langCode,
    });

    const result = learningSessionDataSchema.safeParse(response);
    if (!result.success)
      return errorResponse(res, 500, formatZodErrors(result.error));

    return successResponse(res, 200, result.data);
  } catch (err) {
    return errorResponse(
      res,
      500,
      (err as Error).message || "Unknown error occurred"
    );
  }
}

// TO DO

export async function getProfileDataController(req: Request, res: Response) {
  logger.debug("Profile request", { query: req.query });
  return errorResponse(res, 500, "Implement me");
}
