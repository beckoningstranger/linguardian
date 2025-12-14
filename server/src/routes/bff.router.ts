import express from "express";

import { requireAuth } from "@/middleware/requireAuth";
import { requireLangCode } from "@/middleware/requireLangCode";
import { requireLearningMode } from "@/middleware/requireLearningMode";
import { requireListNumber } from "@/middleware/requireListNumber";
import { requireOverstudyParam } from "@/middleware/requireOverstudyParam";
import { requireUnitNumber } from "@/middleware/requireUnitNumber";
import {
    asAuthenticatedLearningSessionRequestForLanguage,
    asAuthenticatedLearningSessionRequestForList,
    asAuthenticatedLearningSessionRequestForUnit,
    asAuthenticatedRequest,
} from "@/utils";
import {
    getDashboardDataController,
    getEditListDataController,
    getEditUnitDataController,
    getLearningSessionForLanguageDataController,
    getLearningSessionForListDataController,
    getLearningSessionForUnitDataController,
    getListOverviewDataController,
    getListStoreDataController,
    getProfileDataController,
    getUnitOverviewDataController,
} from "@/controllers/bff.controller";

export const bffRouter = express.Router();

bffRouter.get(
    "/dashboard/:language",
    requireAuth,
    asAuthenticatedRequest(getDashboardDataController)
);

bffRouter.get("/list-store/:language", getListStoreDataController);

bffRouter.get(
    "/profile/:user-slug",
    requireAuth,
    asAuthenticatedRequest(getProfileDataController)
);

bffRouter.get(
    "/list/:listNumber",
    requireAuth,
    asAuthenticatedRequest(getListOverviewDataController)
);

bffRouter.get(
    "/edit-list/:listNumber",
    requireAuth,
    asAuthenticatedRequest(getEditListDataController)
);

bffRouter.get(
    "/unit/:listNumber/:unitNumber",
    requireAuth,
    asAuthenticatedRequest(getUnitOverviewDataController)
);

bffRouter.get(
    "/edit-unit/:listNumber/:unitNumber",
    requireAuth,
    asAuthenticatedRequest(getEditUnitDataController)
);

bffRouter.get(
    "/learningSession/:mode/:listNumber",
    requireAuth,
    requireLearningMode,
    requireListNumber,
    requireOverstudyParam,
    asAuthenticatedLearningSessionRequestForList(
        getLearningSessionForListDataController
    )
);

bffRouter.get(
    "/learningSession/:mode/:listNumber/unit/:unitNumber",
    requireAuth,
    requireLearningMode,
    requireListNumber,
    requireUnitNumber,
    requireOverstudyParam,
    asAuthenticatedLearningSessionRequestForUnit(
        getLearningSessionForUnitDataController
    )
);

bffRouter.get(
    "/learningSession/language/:mode/:langCode",
    requireAuth,
    requireLearningMode,
    requireLangCode,
    requireOverstudyParam,
    asAuthenticatedLearningSessionRequestForLanguage(
        getLearningSessionForLanguageDataController
    )
);
