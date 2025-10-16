import { Request, Response } from "express";

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
import { LearningSessionDataService } from "@/lib/services/learning";

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

// export const getLearningSessionDataController =
//   createAuthenticatedRequestHandler({
//     parseParams: fetchLearningSessionParamsSchema,
//     service: LearningSessionDataService,
//     validateOutput: learningSessionDataSchema,
//   });

export async function getLearningSessionForListDataController(
  req: AuthenticatedLearningSessionRequestForList,
  res: Response
) {
  const listNumber = req.listNumber;
  const userId = req.auth.id;
  const learningMode = req.learningMode;

  try {
    const response = await LearningSessionDataService({
      listNumber,
      userId,
      mode: learningMode,
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

  try {
    const response = await LearningSessionDataService({
      listNumber,
      userId,
      mode: learningMode,
      unitNumber,
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
  console.log("profile", req.query);
}
