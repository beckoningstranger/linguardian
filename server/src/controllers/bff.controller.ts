import { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger";

import {
    dashboardDataParamsSchema,
    dashboardDataSchema,
    listOverviewDataParamsSchema,
    listOverviewDataSchema,
    listStoreDataParamsSchema,
    listStoreDataSchema,
    editListPageDataParamsSchema,
    editListPageDataSchema,
    unitDataParamsSchema,
    unitOverviewDataSchema,
    editUnitDataSchema,
} from "@linguardian/shared/contracts";
import { learningSessionDataSchema } from "@linguardian/shared/contracts";
import { DashboardDataService } from "@/services/dashboard";
import { ListStoreDataService } from "@/services/list-store";
import {
    EditListPageDataService,
    ListOverviewDataService,
} from "@/services/lists";
import { EditUnitDataService, UnitOverviewDataService } from "@/services/units";
import {
    AuthenticatedLearningSessionRequestForLanguage,
    AuthenticatedLearningSessionRequestForList,
    AuthenticatedLearningSessionRequestForUnit,
} from "@/types/types";
import {
    createAuthenticatedRequestHandler,
    createUnauthenticatedRequestHandler,
    errorResponse,
    formatZodErrors,
    successResponse,
} from "@/utils";
import {
    LearningSessionDataServiceForLanguage,
    LearningSessionDataServiceForListOrUnit,
} from "@/services/learning";

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
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

export async function getLearningSessionForUnitDataController(
    req: AuthenticatedLearningSessionRequestForUnit,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

export async function getLearningSessionForLanguageDataController(
    req: AuthenticatedLearningSessionRequestForLanguage,
    res: Response,
    next: NextFunction
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
        next(err);
    }
}

// TO DO

export async function getProfileDataController(req: Request, res: Response) {
    logger.debug("Profile request", { query: req.query });
    return errorResponse(res, 500, "Implement me");
}
