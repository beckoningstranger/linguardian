import express from "express";

import { requireAuth } from "@/lib/middleware/requireAuth";
import { requireLearningMode } from "@/lib/middleware/requireLearningMode";
import { requireListNumber } from "@/lib/middleware/requireListNumber";
import { requireUnitNumber } from "@/lib/middleware/requireUnitNumber";
import {
  asAuthenticatedLearningSessionRequestForList,
  asAuthenticatedLearningSessionRequestForUnit,
  asAuthenticatedRequest,
} from "@/lib/utils";
import {
  getDashboardDataController,
  getEditListDataController,
  getEditUnitDataController,
  getLearningSessionForListDataController,
  getLearningSessionForUnitDataController,
  getListOverviewDataController,
  getListStoreDataController,
  getProfileDataController,
  getUnitOverviewDataController,
} from "@/routes/bff/bff.controller";

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
  requireListNumber,
  requireLearningMode,
  asAuthenticatedLearningSessionRequestForList(
    getLearningSessionForListDataController
  )
);

bffRouter.get(
  "/learningSession/:mode/:listNumber/unit/:unitNumber",
  requireAuth,
  requireListNumber,
  requireLearningMode,
  requireUnitNumber,
  asAuthenticatedLearningSessionRequestForUnit(
    getLearningSessionForUnitDataController
  )
);
