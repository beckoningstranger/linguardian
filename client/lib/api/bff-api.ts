import { SERVER } from "@/lib/constants";
import {
  ApiResponse,
  DashboardData,
  DashboardDataParams,
  dashboardDataSchema,
  EditListPageData,
  EditListPageDataParams,
  editListPageDataSchema,
  EditUnitData,
  editUnitDataSchema,
  FetchLearningSessionParams,
  LearningSessionData,
  learningSessionDataSchema,
  ListOverviewData,
  ListOverviewDataParams,
  listOverviewDataSchema,
  ListStoreData,
  ListStoreDataParams,
  listStoreDataSchema,
  UnitDataParams,
  UnitOverviewData,
  unitOverviewDataSchema,
} from "@/lib/contracts";
import {
  dashboardTag,
  handleApiCall,
  handleApiCallWithAuth,
  listStoreTag,
  listTag,
  userTag,
} from "@/lib/utils";

export async function fetchListStoreDataForLanguage({
  language,
}: ListStoreDataParams): Promise<ApiResponse<ListStoreData>> {
  return handleApiCall(
    () =>
      fetch(`${SERVER}/bff/list-store/${language}`, {
        next: {
          tags: [listStoreTag(language)],
        },
      }),
    listStoreDataSchema
  );
}

export async function fetchDashboardDataForUser(
  {
    language,
    allLearnedListNumbers,
  }: DashboardDataParams & { allLearnedListNumbers: number[] },
  userId: string
): Promise<ApiResponse<DashboardData>> {
  return handleApiCallWithAuth(
    (headers) =>
      fetch(`${SERVER}/bff/dashboard/${language}`, {
        headers,
        next: {
          tags: [
            userTag(userId),
            dashboardTag(userId, language),
            ...allLearnedListNumbers.map(listTag),
          ],
        },
      }),
    dashboardDataSchema
  );
}

export async function fetchListOverviewPageData(
  { listNumber }: ListOverviewDataParams,
  userId: string
): Promise<ApiResponse<ListOverviewData>> {
  return handleApiCallWithAuth(
    (headers) =>
      fetch(`${SERVER}/bff/list/${listNumber}`, {
        headers,
        next: { tags: [userTag(userId), listTag(listNumber)] },
      }),
    listOverviewDataSchema
  );
}

export async function fetchEditListPageData({
  listNumber,
}: EditListPageDataParams): Promise<ApiResponse<EditListPageData>> {
  return handleApiCallWithAuth(
    (headers) =>
      fetch(`${SERVER}/bff/edit-list/${listNumber}`, {
        headers,
        cache: "no-store",
      }),
    editListPageDataSchema
  );
}

export async function fetchUnitOverviewPageData({
  unitNumber,
  listNumber,
}: UnitDataParams): Promise<ApiResponse<UnitOverviewData>> {
  return handleApiCallWithAuth(
    (headers) =>
      fetch(`${SERVER}/bff/unit/${listNumber}/${unitNumber}`, {
        headers,
        cache: "no-store",
      }),
    unitOverviewDataSchema
  );
}

export async function fetchEditUnitPageData({
  unitNumber,
  listNumber,
}: UnitDataParams): Promise<ApiResponse<EditUnitData>> {
  return handleApiCallWithAuth(
    (headers) =>
      fetch(`${SERVER}/bff/edit-unit/${listNumber}/${unitNumber}`, {
        headers,
        cache: "no-store",
      }),
    editUnitDataSchema
  );
}

export async function fetchLearningSessionData({
  listNumber,
  unitNumber,
  mode,
}: FetchLearningSessionParams): Promise<ApiResponse<LearningSessionData>> {
  const url = unitNumber
    ? new URL(
        `${SERVER}/bff/learningSession/${mode}/${listNumber}/unit/${unitNumber}`
      )
    : new URL(`${SERVER}/bff/learningSession/${mode}/${listNumber}`);

  return handleApiCallWithAuth(
    (headers) =>
      fetch(url, {
        headers,
        cache: "no-store",
      }),
    learningSessionDataSchema
  );
}
