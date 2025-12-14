"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

import EditItemName from "@/components/Dictionary/EditItemPage/EditItemName";
import EditPartOfSpeechGenderAndCase from "@/components/Dictionary/EditItemPage/EditPartOfSpeechGenderAndCase";
import EnterContextItems from "@/components/Dictionary/EditItemPage/EnterContextItems";
import EnterDefinition from "@/components/Dictionary/EditItemPage/EnterDefinition";
import EnterIPA from "@/components/Dictionary/EditItemPage/IPA/EnterIPA";
import EnterMultipleStrings from "@/components/Dictionary/EditItemPage/EnterMultipleStrings";
import ManageTranslations from "@/components/Dictionary/EditItemPage/ManageTranslations";
import PickMultipleTags from "@/components/Dictionary/EditItemPage/PickMultipleTags";

import ItemLanguagePicker from "@/components/Dictionary/EditItemPage/ItemLanguagePicker";
import { useUser } from "@/context/UserContext";
import { createItemAction, updateItemAction } from "@/lib/actions/item-actions";
import { EDIT_OR_CREATE_ITEM_FORM_ID } from "@/lib/constants";
import { ItemWithPopulatedTranslations } from "@linguardian/shared/contracts";
import paths from "@/lib/paths";
import { allLanguageFeatures } from "@linguardian/shared/constants";
import ManagePromptHelpers from "./ManagePromptHelpers";
import ManageAlternativeAnswers from "./ManageAlternativeAnswers";

interface EditOrCreateItemFormProps {
    item: ItemWithPopulatedTranslations;
    addToUnit?: { listNumber: number; unitName: string; unitNumber: number };
}

export default function EditOrCreateItemForm({
    item,
    addToUnit,
}: EditOrCreateItemFormProps) {
    const { user } = useUser();
    if (!user) throw new Error("Could not get user from context");
    const router = useRouter();

    const isNewItem = item.id === "newItem";
    const methods = useFormContext<ItemWithPopulatedTranslations>();

    const {
        formState: { errors },
        handleSubmit,
        watch,
        control,
        setValue,
    } = methods;

    const itemLanguage = watch("language");
    const languageFeatures = allLanguageFeatures.find(
        (lang) => lang.langCode === itemLanguage
    );
    if (!languageFeatures)
        throw new Error("Invalid language, could not find language features");

    const { langName, flagCode, tags: langTags, ipa } = languageFeatures;

    const onSubmit = async (data: ItemWithPopulatedTranslations) => {
        data.languageName = langName;
        data.flagCode = flagCode;

        if (isNewItem) {
            // Create new item
            const response = await toast.promise(
                createItemAction({
                    item: data,
                    listNumber: addToUnit?.listNumber,
                    unitName: addToUnit?.unitName,
                }),
                {
                    loading: "Creating item...",
                    success: (res) => res.message,
                    error: (err) =>
                        err instanceof Error ? err.message : err.toString(),
                }
            );

            if (
                response.type === "duplicate" &&
                addToUnit?.listNumber &&
                addToUnit.unitNumber
            )
                router.push(
                    `${paths.dictionaryItemPath(
                        response.redirectSlug
                    )}?comingFrom=${paths.editUnitPath(
                        addToUnit?.listNumber,
                        addToUnit?.unitNumber
                    )}`
                );
            if (response.type === "duplicate")
                router.push(paths.dictionaryItemPath(response.redirectSlug));

            if (response.type === "itemInfo")
                router.push(paths.dictionaryItemPath(response.itemInfo.slug));
            return;
        } else {
            const response = await toast.promise(updateItemAction(data), {
                loading: "Updating...",
                success: (res) => res.message,
                error: (err) =>
                    err instanceof Error ? err.message : err.toString(),
            });
            if (response && response.type === "itemInfo")
                router.push(paths.dictionaryItemPath(response.itemInfo.slug));
        }
    };

    const tagOptions = langTags.forAll
        .concat(langTags[watch("partOfSpeech")])
        .filter(Boolean);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex grow"
            id={EDIT_OR_CREATE_ITEM_FORM_ID}
        >
            <div
                className="grid w-full gap-3 overflow-y-auto bg-white/90 px-4 py-6 tablet:px-8 tablet:pt-8"
                id="EditOrCreateItemFormMain"
            >
                <EditItemName
                    itemName={watch("name")}
                    errors={errors}
                    control={control}
                    isNewItem={isNewItem}
                />

                <ItemLanguagePicker
                    isNewItem={isNewItem}
                    activeFlag={!isNewItem ? item.flagCode : user.native.flag}
                    staticFlag={!isNewItem}
                />

                <PickMultipleTags
                    formField="tags"
                    initialValue={item?.tags}
                    label={{ singular: "Tag", plural: "Tags" }}
                    options={tagOptions}
                />

                <EditPartOfSpeechGenderAndCase
                    watch={watch}
                    control={control}
                    errors={errors}
                    itemLanguage={itemLanguage}
                />

                {watch("partOfSpeech") === "noun" && (
                    <EnterMultipleStrings
                        setValue={setValue}
                        formField="pluralForm"
                        initialValue={watch("pluralForm")}
                        label={{
                            singular: "Plural Form",
                            plural: "Plural Forms",
                        }}
                        errors={errors}
                    />
                )}

                <EnterIPA
                    setValue={setValue}
                    initialValue={watch("IPA")}
                    label={{ singular: "IPA", plural: "IPA" }}
                    IPA={ipa}
                />
                <ManageTranslations item={item} />
                <ManageAlternativeAnswers />
                <ManagePromptHelpers />
                <EnterDefinition initialValue={watch("definition")} />
                <EnterContextItems
                    setValue={setValue}
                    initialValue={watch("context")}
                    errors={errors}
                />
            </div>
        </form>
    );
}
