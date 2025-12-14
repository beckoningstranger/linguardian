import { z } from "zod";

import {
    coreItemSchema,
    itemSchemaWithPopulatedTranslations,
    itemSchemaWithTranslations,
} from "@linguardian/shared/contracts";
import { SupportedLanguage } from "@linguardian/shared/contracts";
import { allSupportedLanguages } from "@linguardian/shared/constants";
import { normalizeString, safeDbRead } from "@/utils";
import { ItemModel } from "@/models";

export async function findItemIdBySlug(slug: string) {
    return await safeDbRead({
        dbReadQuery: () =>
            ItemModel.findOne({ slug }).select({ id: true }).lean(),
        schemaForValidation: coreItemSchema.pick({ id: true }),
    });
}

export async function findItemById(id: string) {
    return await safeDbRead({
        dbReadQuery: () => ItemModel.findOne({ _id: id }).lean(),
        schemaForValidation: itemSchemaWithTranslations,
    });
}

export async function findPopulatedItemById(id: string) {
    const paths = allSupportedLanguages.map((lang) => ({
        path: "translations." + lang,
    }));

    return await safeDbRead({
        dbReadQuery: () =>
            ItemModel.findOne({ _id: id }).populate(paths).lean(),
        schemaForValidation: itemSchemaWithPopulatedTranslations,
    });
}

export async function findItemsByQuery(
    languages: SupportedLanguage[],
    query: string
) {
    const normalizedLowerCaseQuery = normalizeString(query);

    return await safeDbRead({
        dbReadQuery: () =>
            ItemModel.find({
                normalizedName: {
                    $regex: normalizedLowerCaseQuery,
                    $options: "i",
                },
                language: { $in: languages },
            }).lean(),
        schemaForValidation: z.array(itemSchemaWithTranslations),
    });
}

export async function findItemByNameLanguageAndPartOfSpeech(
    name: string,
    language: SupportedLanguage,
    partOfSpeech: string
) {
    return await safeDbRead({
        dbReadQuery: () =>
            ItemModel.findOne({
                name,
                language,
                partOfSpeech,
            }).lean(),
        schemaForValidation: itemSchemaWithTranslations,
    });
}
