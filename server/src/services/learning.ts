import {
    FetchLearningSessionForLanguageParams,
    FetchLearningSessionForListOrUnitParams,
    LearningSessionData,
} from "@linguardian/shared/contracts";
import { shuffleArray } from "@/utils";
import {
    assertUser,
    buildBuckets,
    collectItemsFromList,
    computeLearnable,
    dedupeById,
    dueIdsFor,
    filterIgnored,
    getLanguageFeatures,
    getSrsSettings,
    ignoredIdsFor,
    itemsToProcessPool,
    learnedIdsFor,
    pickSessionItems,
    possibleAnswers,
} from "@/utils/learningSessions";
import { findFullyPopulatedListByListNumber } from "@/repositories/list.repo";
import { findUser } from "@/repositories/user.repo";

export async function LearningSessionDataServiceForListOrUnit({
    listNumber,
    mode,
    unitNumber,
    userId,
    overstudy,
}: FetchLearningSessionForListOrUnitParams & {
    userId: string;
}): Promise<LearningSessionData> {
    // User
    const user = assertUser(await findUser({ method: "_id", query: userId }));

    // List
    const listResp = await findFullyPopulatedListByListNumber(listNumber);
    if (!listResp.success) throw new Error("Could not find list");
    const list = listResp.data;
    const langCode = list.language.code;

    // Settings
    const srs = getSrsSettings(user, langCode);
    const features = getLanguageFeatures(langCode);

    // Items (list or unit)
    const allItems = collectItemsFromList(list, unitNumber);

    // User state
    const ignored = ignoredIdsFor(user, langCode);
    const learned = learnedIdsFor(user, langCode);
    const dueIds = dueIdsFor(user, langCode);

    // Pools
    const inScope = allItems;
    const processPool = itemsToProcessPool(inScope, dueIds, overstudy);

    // Buckets
    const learnable = computeLearnable(inScope, user, ignored, learned, mode);
    const buckets = buildBuckets(
        processPool,
        mode,
        user,
        ignored,
        learned,
        overstudy
    );

    // Selection
    const items = pickSessionItems(mode, srs, overstudy, buckets, learnable);

    return {
        targetLanguageFeatures: features,
        listName: list.name,
        possibleAnswers: possibleAnswers(inScope),
        items,
    };
}

export async function LearningSessionDataServiceForLanguage({
    mode,
    langCode,
    userId,
    overstudy,
}: FetchLearningSessionForLanguageParams & {
    userId: string;
}): Promise<LearningSessionData> {
    // User
    const user = assertUser(await findUser({ method: "_id", query: userId }));
    const learnedListsForLanguage = user.learnedLists[langCode] ?? [];

    // Load all lists in parallel
    const lists = await Promise.all(
        learnedListsForLanguage.map(async (listNumber) => {
            const res = await findFullyPopulatedListByListNumber(listNumber);
            if (!res.success) throw new Error(`List ${listNumber} not found`);
            return res.data;
        })
    );

    // Flatten + dedupe + shuffle
    const allItemsRaw = lists.flatMap((l) => l.units.map((u) => u.item));
    const allItems = shuffleArray(dedupeById(allItemsRaw));

    // User state
    const srs = getSrsSettings(user, langCode);
    const features = getLanguageFeatures(langCode);
    const ignored = ignoredIdsFor(user, langCode);
    const learned = learnedIdsFor(user, langCode);
    const dueIds = dueIdsFor(user, langCode);

    const inScope = filterIgnored(allItems, ignored);
    const processPool = itemsToProcessPool(inScope, dueIds, overstudy);

    const buckets = buildBuckets(
        processPool,
        mode,
        user,
        ignored,
        learned,
        overstudy
    );
    // Global “language” scope does not support learn-mode here (as in your code)
    const items = pickSessionItems(mode, srs, overstudy, buckets);

    return {
        targetLanguageFeatures: features,
        listName: "",
        possibleAnswers: possibleAnswers(allItems),
        items,
    };
}
